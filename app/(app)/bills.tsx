import { isBefore, parseISO } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import BillGroupItem from "../../components/bills/BillGroupItem";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import HeaderTitle from "../../components/HeaderTitle";
import TransactionPie from "../../components/transactions/TransactionPie";
import withTabBar from "../../hoc/withTabBar";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_TRANSACTIONS } from "../../lib/constant";
import {
  generateMonthListDropdown,
  getMonthDropdown,
  getStartEndMonthDays,
  isWithinDateInterval,
} from "../../lib/dateHelpers";
import { fetchDocuments } from "../../lib/firebaseFirestore";
import {
  calculateRemainingPercent,
  convertToFloat,
  formatCurrency,
  getExpenseGroupTotal,
  getMainCategoryByCategoryId,
  getPercentage,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";

const monthsDropDown = generateMonthListDropdown(new Date());
const currentMonthDefault = getMonthDropdown(new Date());

const Bills = () => {
  const router = useRouter();
  const { expenses, monthlyTransactions, wallet } = useAppContext();

  const [currentMonth, setCurrentMonth] =
    useState<DropdownItem>(currentMonthDefault);
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] =
    useState<TransactionItem[]>(monthlyTransactions);

  const navigateToAddBills = () => {
    router.push("/bills-edit");
  };

  const handleMonthChange = async (item: DropdownItem) => {
    const currMonth = parseISO(currentMonthDefault.value as string);
    const newMonth = parseISO(item.value as string);
    if (item.id === currentMonthDefault.id) {
      setIsCurrentMonth(true);
      setTransactions(monthlyTransactions);
    } else {
      if (isBefore(newMonth, currMonth)) {
        setIsCurrentMonth(true);
        setIsLoading(true);
        const [start, end] = getStartEndMonthDays(newMonth);

        const newTransactions = await fetchDocuments<TransactionItem>(
          COLLECTION_TRANSACTIONS,
          {
            whereClauses: [
              {
                field: "date",
                operator: ">=",
                value: start,
              },
              {
                field: "date",
                operator: "<=",
                value: end,
              },
            ],
          }
        );

        setTransactions(newTransactions);
        setIsLoading(false);
      } else {
        setIsCurrentMonth(false);
      }
    }
    setCurrentMonth(item);
  };

  const filteredExpenses = expenses.filter((e) => {
    const strToday = currentMonth.value as string;

    return isWithinDateInterval(strToday, e);
  });

  const grouppedExpenses: GroupedExpenseItem[] = [];
  let grandTotal = 0;

  filteredExpenses.map((e) => {
    const mainCategory = getMainCategoryByCategoryId(e.categoryId);
    if (mainCategory) {
      const group = grouppedExpenses.find((x) => x.id === mainCategory?.id);
      if (group) {
        group.data.push(e);
      } else {
        grouppedExpenses.push({ ...mainCategory, data: [e] });
      }
    }
  });

  const grouppedExpensesFront: GroupedExpenseItemFront[] = grouppedExpenses.map(
    (expenseGroup) => {
      const [total, expenseFront] = getExpenseGroupTotal(
        expenseGroup.data,
        currentMonth.value as string
      );
      grandTotal += total;
      return { ...expenseGroup, total, data: expenseFront };
    }
  );

  const unbudgeted: TransactionItem[] = [];
  const budgeted: TransactionItem[] = [];
  let totalUnbudgeted = 0;
  let totalBudgeted = 0;

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.transactionDirection === 0
  );

  expenseTransactions.map((transaction) => {
    if (transaction.budgetId === "") {
      unbudgeted.push(transaction);
      totalUnbudgeted += convertToFloat(transaction.amount);
    } else {
      budgeted.push(transaction);
      totalBudgeted += convertToFloat(transaction.amount);
    }
  });

  const leftToSpend = grandTotal - totalBudgeted;

  const remainingPercent = calculateRemainingPercent(
    grandTotal.toString(),
    totalBudgeted.toString()
  );

  const income = wallet?.monthlyIncome || "0";

  const percentage = getPercentage(convertToFloat(income), grandTotal);

  let colorPercentage = colors.green;
  if (percentage > 75) colorPercentage = colors.red;
  if (percentage > 90) colorPercentage = colors.redVivid;

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderTitle
              onPressButton={navigateToAddBills}
              hasButton
              title="Expenses"
              isLoading={isLoading}
            />
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={{ flex: 1 }}>
            <View style={styles.containerDropdown}>
              <DropDownMenu
                label=""
                id="type"
                value={currentMonth}
                onChange={handleMonthChange}
                data={monthsDropDown}
                labelStyle={styles.labelStyle}
              />
            </View>
            <Text style={styles.textTitle}>{formatCurrency(grandTotal)}</Text>
            <Text style={{ ...styles.textSub, ...{ color: colorPercentage } }}>
              {percentage}% of your monthly income.
            </Text>
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
                    {isCurrentMonth
                      ? formatCurrency(totalBudgeted + totalUnbudgeted)
                      : "$0"}
                  </Text>
                  <View style={styles.progressSeparator} />
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.green },
                    }}
                  >
                    {isCurrentMonth
                      ? formatCurrency(leftToSpend)
                      : formatCurrency(grandTotal)}
                  </Text>
                  <Text style={styles.progressText}>left to spend</Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>
        {totalUnbudgeted > 0 && isCurrentMonth && unbudgeted.length > 0 && (
          <View>
            <TransactionPie isSmall transactions={unbudgeted} />
            <Text style={styles.unbudText}>
              {formatCurrency(totalUnbudgeted)} of unbudgeted expense
            </Text>
          </View>
        )}
        <View>
          {grouppedExpensesFront.map((g) => (
            <BillGroupItem
              setIsLoading={setIsLoading}
              key={g.id}
              groupedExpense={g}
              grandTotal={grandTotal}
              isCurrentMonth={isCurrentMonth}
              currentMonth={currentMonth.value as string}
              transactions={budgeted}
            />
          ))}
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
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
  textTitle: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "900",
    color: colors.blue,
  },
  labelStyle: { fontWeight: "900", color: colors.grayLight },
  container: { marginTop: 8 },
  containerDropdown: { alignItems: "center" },
  textSub: { fontSize: 14, textAlign: "center" },
  progressContainer: {
    marginTop: 40,
    borderWidth: 0.2,
    borderColor: colors.grayLight,
    borderRadius: 10,
    padding: 16,
  },
  progressDetCOntainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressDetTextTop: {
    color: colors.grayLight,
    fontSize: 14,
    marginBottom: 2,
  },
  progressDetTextBottom: {
    fontSize: 24,
    fontWeight: "900",
  },
  unbudText: {
    textAlign: "center",
    marginTop: -8,
    marginBottom: 10,
    fontWeight: "800",
    color: colors.redVivid,
    fontSize: 12,
  },
  monthlyText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600",
    color: colors.grayLight,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});

const BillsScreen = withTabBar(Bills);

export default BillsScreen;
