import { parseISO } from "date-fns";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { BarChart, lineDataItem } from "react-native-gifted-charts";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import HeaderHome from "../../components/HeaderHome";
import Transactions from "../../components/transactions/Transactions";
import withTabBar from "../../hoc/withTabBar";
import { useAppContext } from "../../hook/useAppContext";
import {
  formatDateMonthDateGraph,
  generateLastTenDays,
  getMonthDropdown,
  groupTransactionByDate,
  isWithinDateInterval,
} from "../../lib/dateHelpers";
import {
  calculateRemainingPercent,
  convertToFloat,
  formatCurrency,
  getExpenseGroupTotal,
  getMainCategoryByCategoryId,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";

const currentMonth = getMonthDropdown(new Date());

const LabelComponent = (val: string) => {
  const date = parseISO(val);
  const value = formatDateMonthDateGraph(date);

  return (
    <View>
      <Text
        style={{
          color: colors.grayLight,
          fontSize: 10,
          textAlign: "center",
        }}
      >
        {value}
      </Text>
    </View>
  );
};

const Home = () => {
  const {
    user,
    monthlyTransactions,
    lastTenDaysTransactions,
    wallet,
    expenses,
  } = useAppContext();

  if (!user) return null;

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

  grouppedExpenses.map((expenseGroup) => {
    const [total, expenseFront] = getExpenseGroupTotal(
      expenseGroup.data,
      currentMonth.value as string
    );
    grandTotal += total;
    return { ...expenseGroup, total, data: expenseFront };
  });

  const incomeTransactions = monthlyTransactions.filter(
    (transaction) => transaction.transactionDirection === 1
  );
  const totalIncome = incomeTransactions.reduce(
    (acc, transaction) => acc + convertToFloat(transaction.amount),
    0
  );
  const remainingPercentIncome = calculateRemainingPercent(
    wallet?.monthlyIncome || "0",
    totalIncome.toString()
  );

  const groupedTransactions = groupTransactionByDate(lastTenDaysTransactions);
  const latTen = generateLastTenDays();

  let dataGraph: lineDataItem[] = [];
  for (const transaction of groupedTransactions) {
    const totalData = transaction.data.reduce(
      (acc, transaction) => acc + convertToFloat(transaction.amount),
      0
    );
    const dataItem = {
      value: totalData,
      labelComponent: () => LabelComponent(transaction.formatedDateShort),
      label: transaction.formatedDateShort,
      frontColor: colors.green,
    };
    dataGraph.push(dataItem);
  }
  const merged = latTen
    .map((date) => {
      const found = dataGraph.find((v) => v.label === date);
      if (found) return found;
      return {
        value: 0,
        labelComponent: () => LabelComponent(date),
        label: date,
        frontColor: colors.green,
      };
    })
    .reverse();

  dataGraph = merged;

  const maxValue = Math.max(...dataGraph.map((item) => item.value || 0));

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => <HeaderHome />,
        }}
      />
      <View>
        <View style={styles.cont}>
          <View style={styles.containerText}>
            <Text style={styles.textSubTitle}>Available Balance</Text>
            <Text style={styles.textTitle}>
              {formatCurrency(wallet?.amount || "0")}
            </Text>
            <View style={styles.progressSeparatorLeft} />
            <Text style={styles.textTitleSub}>
              {formatCurrency(grandTotal)}
            </Text>
            <Text style={styles.textSubTitle}>This month's budget</Text>
          </View>
          <View>
            <AnimatedCircularProgress
              size={150}
              width={10}
              lineCap="round"
              fill={remainingPercentIncome}
              tintColor={colors.green}
              backgroundColor={colors.gray}
              arcSweepAngle={280}
              rotation={220}
            >
              {() => (
                <View style={styles.progressViewCont}>
                  <Text style={styles.progressText}>received income</Text>
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.green },
                    }}
                  >
                    {formatCurrency(totalIncome)}
                  </Text>
                  <View style={styles.progressSeparator} />
                  <Text
                    style={{
                      ...styles.progressPrice,
                      ...{ color: colors.grayLight },
                    }}
                  >
                    {formatCurrency(wallet?.monthlyIncome || "0")}
                  </Text>
                  <Text style={styles.progressText}>Monthly{"  "} income</Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>

        {dataGraph.length > 0 && (
          <View>
            <BarChart
              isAnimated
              data={dataGraph}
              initialSpacing={0}
              spacing={16}
              barWidth={23}
              barBorderRadius={4}
              maxValue={maxValue + 110}
              showGradient
              hideRules
              hideAxesAndRules
              yAxisThickness={0}
              xAxisThickness={0}
              hideYAxisText
              gradientColor={colors.blue}
              renderTooltip={(item: lineDataItem) => {
                return (
                  <View style={styles.tooltip}>
                    <Text style={styles.toolText}>
                      {formatCurrency(item.value as number)}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        )}
        <View style={styles.transacCont}>
          <Transactions
            showFooter
            showTitle
            data={lastTenDaysTransactions.slice(0, 10)}
          />
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  toolText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.black,
  },
  tooltip: {
    marginBottom: 4,
    backgroundColor: colors.white,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transacCont: {
    marginVertical: 20,
  },
  transacContTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  transacContTopText: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.white,
  },
  transacContTopBtnCOnt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  transacContTopBtn: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.grayLight,
    marginBottom: 2,
  },
  containerText: {
    marginTop: -6,
    flex: 1,
    alignItems: "center",
  },
  textTitle: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "900",
    color: colors.blue,
    marginTop: -6,
  },
  textTitleSub: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: "900",
    color: colors.grayLight,
  },
  textSubTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "200",
    color: colors.grayLight,
    textTransform: "uppercase",
  },
  addBtn: {
    position: "absolute",
    right: 0,
  },
  cont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
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
  progressSeparatorLeft: {
    height: 1,
    width: 100,
    backgroundColor: colors.grayLight,
  },
});

const HomeScreen = withTabBar(Home);

export default HomeScreen;
