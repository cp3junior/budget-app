import { Progress, ProgressFilledTrack, Spinner } from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_TRANSACTIONS } from "../../lib/constant";
import { convertToDate, formatDateTransaction } from "../../lib/dateHelpers";
import { fetchDocuments } from "../../lib/firebaseFirestore";
import {
  calculateRemaining,
  calculateRemainingPercent,
  formatCurrency,
  getCategoryByCategoryId,
  getTransactionTypeById,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";

const WishlistDetails = () => {
  const { wishlists } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const wishlistId = params.wishlistId as string;
  if (!wishlistId) return null;

  const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);
  if (!currentWishlist) return null;

  useEffect(() => {
    const fetchData = async () => {
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

        setTransactions(sortedTransactions);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [wishlists]);

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
        <Text style={styles.nameText}>{currentWishlist.name}</Text>
        {currentWishlist.description && (
          <Text style={styles.desctText}>{currentWishlist.description}</Text>
        )}

        <View style={styles.progressContainer}>
          <Text style={styles.progressAmountText}>
            Total: {formatCurrency(currentWishlist.fullAmount)}
          </Text>
          <View style={styles.progressBar}>
            <Progress value={isCompleted ? 100 : remainingPercent} size="sm">
              <ProgressFilledTrack bgColor={colors.purple} />
            </Progress>
          </View>
          <View style={styles.progressDetCOntainer}>
            <View>
              <Text style={styles.progressDetTextTop}>Paid to date</Text>
              <Text style={styles.progressDetTextBottom}>
                {isCompleted
                  ? formatCurrency(currentWishlist.fullAmount)
                  : formatCurrency(currentWishlist.amount)}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  ...styles.progressDetTextTop,
                  ...{ textAlign: "right" },
                }}
              >
                Remaining
              </Text>
              <Text
                style={{
                  ...styles.progressDetTextBottom,
                  ...{ textAlign: "right" },
                }}
              >
                {isCompleted ? "$0" : remainingAmount}
              </Text>
            </View>
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
              const transactionType = getTransactionTypeById(
                transaction.transactionTypeId
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
                        {transactionType?.label || ""}
                      </Text>
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
  loadCOntainer: { marginTop: 40 },
  nameText: { fontSize: 23, marginBottom: 5, fontWeight: "900" },
  desctText: { color: colors.grayLight, marginBottom: 20 },
  progressContainer: {
    marginTop: 10,
    borderWidth: 0.2,
    borderColor: colors.grayLight,
    borderRadius: 10,
    padding: 16,
  },
  progressAmountText: {
    textAlign: "center",
    fontSize: 18,
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
  timelineContainerMain: { marginTop: 40 },
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
    fontSize: 14,
    color: colors.grayLight,
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
});

export default WishlistDetails;
