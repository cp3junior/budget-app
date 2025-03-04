import { Spinner } from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import SFSymbol from "sweet-sfsymbols";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import ProfileImage from "../../components/common/ProfileImage";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import {
  COLLECTION_USER,
  frequencyItem,
  transactionTypes,
} from "../../lib/constant";
import {
  convertToDate,
  formatDateExpense,
  formatDateSimple,
  formatDateTransaction,
  formatHour,
} from "../../lib/dateHelpers";
import { fetchDocuments } from "../../lib/firebaseFirestore";
import {
  calculateRemainingPercent,
  convertToFloat,
  formatCurrency,
  getCategoryByCategoryId,
  getDropdownItemById,
  getExpenseTotal,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";
import Autolink from "react-native-autolink";

const BillsDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { expenses, user, monthlyTransactions } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItemWithUser[]>(
    []
  );

  let message = "per month";
  const billsId = params.billsId as string;
  const isCurrentMonthStr = params.isCurrentMonth as string;
  const currentMonth = params.currentMonth as string;
  const isCurrentMonth = isCurrentMonthStr === "true" ? true : false;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return null;
      if (!billsId) return null;

      const currentExpense = expenses.find((exp) => exp.id === billsId);
      if (!currentExpense) return null;
      const budgetTransactions = monthlyTransactions.filter(
        (tr) => tr.budgetId === currentExpense.id
      );

      if (budgetTransactions.length > 0) {
        setIsLoading(true);
        const sortedTransactions = budgetTransactions.sort(
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
  }, [monthlyTransactions, expenses]);

  if (!billsId) return null;
  if (!user) return null;

  const currentExpense = expenses.find((exp) => exp.id === billsId);
  if (!currentExpense) return null;

  const category = getCategoryByCategoryId(currentExpense.categoryId);

  if (currentExpense.isRecurring) {
    if (currentExpense.frequency === frequencyItem["2weeks"]) {
      message = `${formatCurrency(currentExpense.amount)} every 2 weeks`;
    }
    if (currentExpense.frequency === frequencyItem.week) {
      message = `${formatCurrency(currentExpense.amount)} every week`;
    }
  }

  const budgetTransactions = monthlyTransactions.filter(
    (tr) => tr.budgetId === currentExpense.id
  );

  const [expenseTotal, dates] = getExpenseTotal(currentExpense, currentMonth);
  const spent = budgetTransactions.reduce(
    (total, transaction) => total + convertToFloat(transaction.amount),
    0
  );
  const remaining = expenseTotal - spent;
  const remainingPercent = calculateRemainingPercent(
    expenseTotal.toString(),
    spent.toString()
  );

  const time = formatHour(currentExpense.notificationTime);

  const navigateToAddTransaction = () => {
    router.push({
      pathname: "/add-transaction",
      params: { expenseId: currentExpense.id },
    });
  };

  const handleEditExpense = () => {
    router.push({
      pathname: "/bills-edit",
      params: { expenseId: currentExpense.id },
    });
  };

  return (
    <SafeContainer
      hasHeader
      footerView={
        <View style={styles.containerBtns}>
          <View style={styles.footerCOntainer}>
            <FormListContainer style={styles.containerStyle}>
              <FormListButtonLink
                label="Edit"
                hasIcon={false}
                color={colors.blue}
                textStyle={{ ...styles.textStyle, ...{ fontWeight: "500" } }}
                onPress={handleEditExpense}
              />
            </FormListContainer>
          </View>
          {isCurrentMonth && (
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
          )}
        </View>
      }
    >
      <Stack.Screen
        options={{
          headerTitle: "Expense details",
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
            <Text style={styles.nameText}>{currentExpense.name}</Text>
            {currentExpense.description && (
              <Autolink
                url
                linkStyle={{ color: colors.blue }}
                textProps={{ style: styles.desctText }}
                text={currentExpense.description}
              />
            )}
          </View>
          <View>
            <AnimatedCircularProgress
              size={150}
              width={10}
              lineCap="round"
              fill={isCurrentMonth ? remainingPercent : 0}
              tintColor={colors.purple}
              backgroundColor={colors.gray}
              arcSweepAngle={280}
              rotation={220}
            >
              {() => (
                <View style={styles.progressViewCont}>
                  <Text style={styles.progressText}>spent</Text>
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.red },
                    }}
                  >
                    {isCurrentMonth ? formatCurrency(spent) : "$0"}
                  </Text>
                  <View style={styles.progressSeparator} />
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.green },
                    }}
                  >
                    {isCurrentMonth
                      ? formatCurrency(remaining)
                      : formatCurrency(expenseTotal)}
                  </Text>
                  <Text style={styles.progressText}>left to spend</Text>
                </View>
              )}
            </AnimatedCircularProgress>
            <Text style={styles.progressAmountText}>
              {formatCurrency(expenseTotal)}
              {message && (
                <Text style={{ fontSize: 13, color: colors.grayLight }}>
                  {" "}
                  ({message})
                </Text>
              )}
            </Text>
          </View>
        </View>
        {currentExpense.isRecurring && (
          <View>
            <Text style={styles.devStyle}>Due dates</Text>
            <FormListContainer style={styles.containerDates}>
              {dates.map((date, index) => {
                const key = formatDateSimple(date);
                const showSeparator: boolean = dates.length !== index + 1;
                return (
                  <Fragment key={key}>
                    <View style={styles.dateStyleContainer}>
                      <Text style={styles.dateStyleText}>
                        {formatDateExpense(date)}
                      </Text>
                      {currentExpense.notificationEnabled && (
                        <View style={styles.notifIcon}>
                          <Text style={styles.textNotif}>{time}</Text>
                          <SFSymbol
                            weight="medium"
                            size={14}
                            name="alarm.waves.left.and.right"
                            colors={[colors.blue]}
                          />
                        </View>
                      )}
                    </View>
                    {showSeparator && <FormListSeparator />}
                  </Fragment>
                );
              })}
            </FormListContainer>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadCOntainer}>
            <Spinner color={colors.purple} />
          </View>
        ) : (
          <View style={styles.timelineContainerMain}>
            {transactions.map((transaction, index) => {
              const isLast = index === transactions.length - 1;
              const transacType = getDropdownItemById(
                transactionTypes,
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
                        {transacType?.label || ""}
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
  notifIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
  },
  textNotif: {
    marginRight: 14,
    fontSize: 18,
    fontWeight: "700",
    color: colors.blue,
  },
  containerDates: {
    padding: 0,
  },
  devStyle: {
    marginTop: 20,
    textTransform: "uppercase",
    fontSize: 17,
    fontWeight: "500",
    color: colors.grayLight,
    paddingLeft: 20,
    marginBottom: 8,
  },
  dateStyleContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateStyleText: {
    fontSize: 16,
    fontWeight: "700",
  },
  contentScroll: {
    marginBottom: 60,
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
    fontSize: 13,
    fontWeight: "900",
    marginTop: -5,
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
  containerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },

  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  textStyle: { textAlign: "center", fontWeight: "900" },
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
  ontentScroll: {
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

export default BillsDetails;
