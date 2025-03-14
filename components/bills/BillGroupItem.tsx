import { useRouter } from "expo-router";
import React, { Fragment } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import SFSymbol from "sweet-sfsymbols";
import {
  COLLECTION_EXPENSES,
  COLLECTION_TRANSACTIONS,
} from "../../lib/constant";
import { formatDateMonthDate, getNextDate } from "../../lib/dateHelpers";
import {
  deleteDocument,
  fetchDocuments,
  updateDocument,
} from "../../lib/firebaseFirestore";
import {
  calculateRemainingPercent,
  convertToFloat,
  formatCurrency,
  getPercentage,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";
import FormListContainer from "../common/FormList/FormListContainer";
import FormListSeparator from "../common/FormList/FormListSeparator";
import Text from "../common/Text";

interface BillGroupItemProps {
  groupedExpense: GroupedExpenseItemFront;
  grandTotal: number;
  currentMonth: string;
  isCurrentMonth: boolean;
  transactions: TransactionItem[];
  setIsLoading: (val: boolean) => void;
}
const BillGroupItem = ({
  groupedExpense,
  grandTotal,
  isCurrentMonth,
  transactions,
  currentMonth,
  setIsLoading,
}: BillGroupItemProps) => {
  const router = useRouter();

  if (!groupedExpense) return null;
  if (groupedExpense.total === 0) return null;

  const percentage = getPercentage(grandTotal, groupedExpense.total);
  const filteredTransactions = transactions.filter((transaction) =>
    groupedExpense.items?.find((item) => item.id === transaction.categoryId)
  );
  const spentTotal = filteredTransactions.reduce(
    (total, transaction) => total + convertToFloat(transaction.amount),
    0
  );
  const remainingTotal = groupedExpense.total - spentTotal;

  const remainingPercentTotal = calculateRemainingPercent(
    groupedExpense.total.toString(),
    spentTotal.toString()
  );

  const navigateToDetails = (id: string) => {
    router.push({
      pathname: "/bills-details",
      params: { billsId: id, isCurrentMonth, currentMonth },
    });
  };

  const showDeletePrompt = (expense: ExpenseItem) => {
    let message = "Are you sure you want to delete this?";

    Alert.alert("Delete expense", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleCheckDelete(expense),
        style: "destructive",
      },
    ]);
  };

  const handleCheckDelete = async (expense: ExpenseItem) => {
    setIsLoading(true);
    const concernedTransactions = await fetchDocuments<TransactionItem>(
      COLLECTION_TRANSACTIONS,
      {
        whereClauses: [
          { field: "budgetId", value: expense.id, operator: "==" },
        ],
      }
    );

    if (concernedTransactions.length > 0) {
      setIsLoading(false);
      Alert.alert(
        "Delete expense",
        "⚠️ This expense is associated with some transactions.\n Deleting it will set the concerned transactions to Unbudgeted which is not adviced. Instead just modify the ending date to any past date.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Proceed",
            onPress: () => handleDelete(expense, concernedTransactions),
            style: "destructive",
          },
        ]
      );
    } else {
      handleDelete(expense, concernedTransactions);
    }
  };
  const handleDelete = async (
    expense: ExpenseItem,
    concernedTransactions: TransactionItem[]
  ) => {
    setIsLoading(true);

    if (concernedTransactions.length > 0) {
      for (const transac of concernedTransactions) {
        await updateDocument(COLLECTION_TRANSACTIONS, transac.id, {
          budgetId: "",
        });
      }
    }

    await deleteDocument(COLLECTION_EXPENSES, expense.id);
    setIsLoading(false);
  };

  return (
    <FormListContainer style={styles.container}>
      <View style={styles.containerTop}>
        <View style={styles.containerTopIcon}>
          <AnimatedCircularProgress
            size={50}
            width={4}
            lineCap="round"
            fill={remainingPercentTotal}
            tintColor={colors.purple}
            backgroundColor={colors.gray}
            rotation={180}
          >
            {() => (
              <SFSymbol
                weight="regular"
                size={21}
                name={groupedExpense.icon || "questionmark"}
                colors={[colors.grayLight]}
              />
            )}
          </AnimatedCircularProgress>
        </View>
        <View style={styles.containerTopText}>
          <Text style={styles.containerTopTextLabel}>
            {groupedExpense.label}
          </Text>
          <Text style={styles.containerTopTextPercent}>
            {percentage}% of budget
          </Text>
        </View>
        <View style={styles.containerTopAmount}>
          <Text style={styles.containerTopAmountText}>
            {formatCurrency(groupedExpense.total)}
          </Text>
          <Text style={styles.containerTopAmountSubText}>
            {isCurrentMonth
              ? formatCurrency(remainingTotal)
              : formatCurrency(groupedExpense.total)}{" "}
            remaining
          </Text>
        </View>
      </View>
      <View>
        {groupedExpense.data.map((expense, index) => {
          if (expense.total === 0) return null;

          const showSeparator: boolean =
            groupedExpense.data.length !== index + 1;

          const isRecurring = expense.isRecurring;
          const nextDueDate = getNextDate(expense.dates);

          const budgetTransactions = filteredTransactions.filter(
            (tr) => tr.budgetId === expense.id
          );

          const spent = budgetTransactions.reduce(
            (total, transaction) => total + convertToFloat(transaction.amount),
            0
          );
          const remaining = expense.total - spent;
          const remainingPercent = calculateRemainingPercent(
            expense.total.toString(),
            spent.toString()
          );

          return (
            <Fragment key={expense.id}>
              <TouchableOpacity
                style={styles.cont}
                onPress={() => navigateToDetails(expense.id)}
                onLongPress={() => showDeletePrompt(expense)}
              >
                <View style={styles.contIcon}>
                  <AnimatedCircularProgress
                    size={36}
                    width={2}
                    lineCap="round"
                    fill={isCurrentMonth ? remainingPercent : 0}
                    tintColor={colors.purple}
                    backgroundColor={colors.gray}
                    rotation={180}
                  >
                    {() => (
                      <SFSymbol
                        weight="regular"
                        size={16}
                        name={expense?.category?.icon || "questionmark"}
                        colors={[colors.grayLight]}
                      />
                    )}
                  </AnimatedCircularProgress>
                  {expense.notificationEnabled && (
                    <View style={styles.notifIcon}>
                      <SFSymbol
                        weight="medium"
                        size={10}
                        name="alarm.waves.left.and.right"
                        colors={[colors.blue]}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.contData}>
                  <View style={styles.contDataTexts}>
                    <View style={styles.contTextTop}>
                      <Text style={styles.contTextTopTitle}>
                        {expense.name}
                      </Text>
                      <Text style={styles.contTextTopSub}>
                        {isCurrentMonth
                          ? formatCurrency(remaining)
                          : formatCurrency(expense.total)}{" "}
                        <Text style={styles.contTextTopSubSub}>
                          left from {formatCurrency(expense.total)}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.chevronCont}>
                      <SFSymbol
                        weight="regular"
                        size={14}
                        name="chevron.right"
                        colors={[colors.grayLight]}
                      />
                      {isRecurring && nextDueDate && (
                        <View style={styles.chevronContTextCont}>
                          <Text style={styles.chevronContText}>
                            Due on: {formatDateMonthDate(nextDueDate)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              {showSeparator && (
                <View style={styles.containerSeparator}>
                  <FormListSeparator />
                </View>
              )}
            </Fragment>
          );
        })}
      </View>
    </FormListContainer>
  );
};

const styles = StyleSheet.create({
  cont: {
    paddingRight: 10,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  contIcon: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginRight: 3,
  },
  contData: { flex: 1 },
  contDataTexts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  chevronCont: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chevronContText: {
    fontSize: 13,
    color: colors.grayLight,
  },
  contTextTop: {},
  chevronContTextCont: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contTextTopTitle: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 2,
    fontWeight: "900",
  },
  contTextTopSub: {
    color: colors.red,
    fontSize: 14,
    fontWeight: "600",
  },
  contTextTopSubSub: {
    color: colors.grayLight,
    fontSize: 12,
    fontWeight: "700",
  },
  notifIcon: {
    position: "absolute",
    top: -6,
    right: -3,
  },
  containerSeparator: { paddingLeft: 50 },
  container: { paddingHorizontal: 0, paddingVertical: 8 },
  containerTop: {
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  containerTopIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTopText: {
    flex: 1,
  },
  containerTopTextLabel: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  containerTopTextPercent: {
    fontSize: 14,
    color: colors.grayLight,
  },
  containerTopAmount: {
    alignItems: "flex-end",
  },
  containerTopAmountText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
    color: colors.blue,
  },
  containerTopAmountSubText: {
    fontSize: 14,
    color: colors.grayLight,
  },
});

export default BillGroupItem;
