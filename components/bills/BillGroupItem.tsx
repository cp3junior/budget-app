import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React, { Fragment } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { formatDateMonthDate, getNextDate } from "../../lib/dateHelpers";
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
}
const BillGroupItem = ({
  groupedExpense,
  grandTotal,
  isCurrentMonth,
  transactions,
  currentMonth,
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

  const navigateToDetails = (id: string) => {
    router.push({
      pathname: "/bills-details",
      params: { billsId: id, isCurrentMonth, currentMonth },
    });
  };

  return (
    <FormListContainer style={styles.container}>
      <View style={styles.containerTop}>
        <View style={styles.containerTopIcon}>
          <SFSymbol
            weight="medium"
            size={21}
            name={groupedExpense.icon || "questionmark"}
            colors={[colors.grayLight]}
          />
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
              >
                <View style={styles.contIcon}>
                  <SFSymbol
                    weight="thin"
                    size={17}
                    name={expense?.category?.icon || "questionmark"}
                    colors={[colors.grayLight]}
                  />
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
                        left from{" "}
                        <Text style={styles.contTextTopSubSub}>
                          {formatCurrency(expense.total)}
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
                        <Text style={styles.chevronContText}>
                          Due on: {formatDateMonthDate(nextDueDate)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View>
                    <Progress
                      value={isCurrentMonth ? remainingPercent : 0}
                      size="xs"
                    >
                      <ProgressFilledTrack bgColor={colors.purple} />
                    </Progress>
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
    marginVertical: 10,
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
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.gray,
    position: "relative",
    marginRight: 3,
  },
  contData: { flex: 1 },
  contDataTexts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  chevronCont: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 3,
  },
  chevronContText: {
    fontSize: 13,
    color: colors.grayLight,
  },
  contTextTop: {},
  contTextTopTitle: {
    color: colors.white,
    fontSize: 20,
    marginBottom: 2,
    fontWeight: "900",
  },
  contTextTopSub: {
    color: colors.grayLight,
    fontSize: 16,
    fontWeight: "600",
  },
  contTextTopSubSub: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "700",
  },
  notifIcon: {
    position: "absolute",
    top: -6,
    right: -3,
  },
  containerSeparator: { paddingLeft: 50 },
  container: { paddingHorizontal: 0, paddingVertical: 14 },
  containerTop: {
    marginBottom: 16,
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
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.gray,
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
    fontSize: 16,
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
