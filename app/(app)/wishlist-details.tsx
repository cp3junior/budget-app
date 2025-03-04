import { Spinner } from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import SFSymbol from "sweet-sfsymbols";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import ProfileImage from "../../components/common/ProfileImage";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_TRANSACTIONS, COLLECTION_USER } from "../../lib/constant";
import { convertToDate, formatDateTransaction } from "../../lib/dateHelpers";
import { fetchDocuments } from "../../lib/firebaseFirestore";
import {
  calculateRemaining,
  calculateRemainingPercent,
  formatCurrency,
  getCategoryByCategoryId,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";
import Autolink from "react-native-autolink";

const WishlistDetails = () => {
  const { wishlists, user, expenses } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItemWithUser[]>(
    []
  );

  const wishlistId = params.wishlistId as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!wishlistId) return null;
      const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);
      if (!currentWishlist) return null;
      if (!user) return null;

      const currentTransactions = currentWishlist.transactions;
      if (currentTransactions.length > 0) {
        setIsLoading(true);
        const transactionItems = await fetchDocuments<TransactionItem>(
          COLLECTION_TRANSACTIONS,
          {
            ids: currentTransactions,
          }
        );
        const sortedTransactions = transactionItems.sort(
          (a, b) =>
            convertToDate(a.date).getTime() - convertToDate(b.date).getTime()
        );

        let userIds = sortedTransactions.map((t) => t.userId);
        userIds = [...new Set(userIds)];
        userIds = userIds.filter((u) => u !== user.id);

        let users: User[] = [];

        if (userIds.length > 0) {
          users = await fetchDocuments<User>(COLLECTION_USER, {
            ids: userIds,
          });
        }

        const transactionItemsWithUser: TransactionItemWithUser[] =
          sortedTransactions.map((t) => {
            let userTransaction = user;
            let displayName = "You";
            const userId = t.userId;

            if (userId !== user.id) {
              const userDB = users.find((u) => u.id === userId);
              if (userDB) {
                userTransaction = userDB;
                displayName = `${userDB.firstName} ${userDB.lastName}`;
              }
            }

            return {
              ...t,
              user: userTransaction,
              displayName,
            };
          });

        setTransactions(transactionItemsWithUser);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [wishlists, wishlistId]);

  if (!wishlistId) return null;

  const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);
  if (!currentWishlist) return null;
  if (!user) return null;

  const remainingAmount = calculateRemaining(
    currentWishlist.fullAmount,
    currentWishlist.amount
  );

  const remainingPercent = calculateRemainingPercent(
    currentWishlist.fullAmount,
    currentWishlist.amount
  );

  const isCompleted = currentWishlist.completed;

  const category = getCategoryByCategoryId(currentWishlist.categoryId);

  const navigateToAddTransaction = () => {
    router.push({
      pathname: "/add-transaction",
      params: { wishlistId },
    });
  };

  const handleEditWishlist = () => {
    router.push({
      pathname: "/wishlist-edit",
      params: { wishlistId },
    });
  };

  return (
    <SafeContainer
      hasHeader
      footerView={
        !isCompleted && (
          <View style={styles.containerBtns}>
            <View style={styles.footerCOntainer}>
              <FormListContainer style={styles.containerStyle}>
                <FormListButtonLink
                  label="Edit"
                  hasIcon={false}
                  color={colors.blue}
                  textStyle={{ ...styles.textStyle, ...{ fontWeight: "500" } }}
                  onPress={handleEditWishlist}
                />
              </FormListContainer>
            </View>
            <View style={[styles.footerCOntainer, { flex: 2 }]}>
              <FormListContainer style={styles.containerStyle}>
                <FormListButtonLink
                  label="Make a payment"
                  hasIcon={false}
                  color={colors.green}
                  textStyle={styles.textStyle}
                  onPress={navigateToAddTransaction}
                />
              </FormListContainer>
            </View>
          </View>
        )
      }
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.containerIcon}>
              <SFSymbol
                weight="regular"
                size={13}
                name={category?.icon ? category.icon : "questionmark"}
                colors={[colors.grayLight]}
              />
            </View>
          ),
        }}
      />
      <View style={styles.contentScroll}>
        <View style={styles.cont}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.nameText}>{currentWishlist.name}</Text>
            {currentWishlist.description && (
              <Autolink
                url
                linkStyle={{ color: colors.blue }}
                textProps={{ style: styles.desctText }}
                text={currentWishlist.description}
              />
            )}
          </View>
          <View>
            <AnimatedCircularProgress
              size={150}
              width={10}
              lineCap="round"
              fill={isCompleted ? 100 : remainingPercent}
              tintColor={colors.purple}
              backgroundColor={colors.gray}
              arcSweepAngle={280}
              rotation={220}
            >
              {() => (
                <View style={styles.progressViewCont}>
                  <Text style={styles.progressText}>Paid to date</Text>
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.green },
                    }}
                  >
                    {isCompleted
                      ? formatCurrency(currentWishlist.fullAmount)
                      : formatCurrency(currentWishlist.amount)}
                  </Text>
                  <View style={styles.progressSeparator} />
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.red },
                    }}
                  >
                    {isCompleted ? "$0" : remainingAmount}
                  </Text>
                  <Text style={styles.progressText}>Remaining</Text>
                </View>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.progressAmountText}>
              Total: {formatCurrency(currentWishlist.fullAmount)}
            </Text>
          </View>
        </View>
        {isLoading ? (
          <View style={styles.loadCOntainer}>
            <Spinner color={colors.purple} />
          </View>
        ) : (
          <View style={styles.timelineContainerMain}>
            {transactions.map((transaction, index) => {
              const isLast = index === transactions.length - 1;
              const expense = expenses.find(
                (expense) => expense.id === transaction.budgetId
              );
              return (
                <View key={transaction.id} style={styles.timelineContainer}>
                  <View style={styles.timeline}>
                    <View style={styles.circle} />
                    {!isLast && <View style={styles.line} />}
                  </View>
                  <View style={styles.contentTimeline}>
                    <View>
                      <Text style={styles.title}>
                        Paid: {formatDateTransaction(transaction.date)}
                      </Text>
                      <Text style={styles.type}>
                        {expense?.name || "Unbudgeted expense"}
                      </Text>
                      <View style={styles.containerImg}>
                        <View style={styles.userImageContainer}>
                          <ProfileImage
                            style={styles.userImage}
                            externalUser={transaction.user}
                          />
                        </View>
                        <Text style={styles.type}>
                          {transaction?.displayName || ""}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.priceText}>
                        {formatCurrency(transaction.amount)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  cont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  progressViewCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: colors.grayLight,
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 11,
  },
  progressPrice: {
    fontSize: 21,
    fontWeight: "900",
  },
  progressSeparator: {
    height: 1,
    width: 35,
    backgroundColor: colors.grayLight,
    marginVertical: 5,
  },
  loadCOntainer: { marginTop: 40 },
  nameText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "900",
    textAlign: "center",
  },
  desctText: {
    color: colors.grayLight,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  progressContainer: {
    marginTop: 10,
    borderWidth: 0.2,
    borderColor: colors.grayLight,
    borderRadius: 10,
    padding: 16,
  },
  progressAmountText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "900",
  },
  progressBar: { marginBottom: 10 },
  progressDetCOntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressDetTextTop: {
    color: colors.grayLight,
    fontSize: 14,
    marginBottom: 2,
  },
  progressDetTextBottom: {
    fontSize: 18,
    fontWeight: "600",
  },
  footerCOntainer: {
    height: 110,
    flex: 1,
  },
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  textStyle: { textAlign: "center", fontWeight: "900" },
  containerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  contentScroll: {
    marginBottom: 60,
  },
  timelineContainerMain: { marginTop: 20 },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timeline: {
    alignItems: "center",
    width: 30,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.purple,
  },
  line: {
    width: 1,
    backgroundColor: colors.purple,
    flex: 1,
  },
  contentTimeline: {
    flex: 1,
    paddingLeft: 5,
    paddingBottom: 20,
    marginTop: -5,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  type: {
    fontSize: 16,
    color: colors.grayLight,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "900",
  },
  containerIcon: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 10,
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },
  userImageContainer: {
    padding: 2,
    borderWidth: 0.8,
    borderColor: colors.purple,
    borderRadius: 200,
  },
  containerImg: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    marginTop: 5,
  },
});

export default WishlistDetails;
