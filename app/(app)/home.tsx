import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { LineChart } from "react-native-gifted-charts";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import HeaderHome from "../../components/HeaderHome";
import Transactions from "../../components/transactions/Transactions";
import withTabBar from "../../hoc/withTabBar";
import { useAppContext } from "../../hook/useAppContext";
import {
  convertToDate,
  getMonthDropdown,
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

const lcomp = (val: string) => {
  return (
    <View style={{ width: 70 }}>
      <Text
        style={{
          color: colors.grayLight,
          fontSize: 11,
          transform: [{ translateY: 23 }, { rotate: "30deg" }],
        }}
      >
        {val}
      </Text>
    </View>
  );
};

const currentData = [
  {
    value: 100,

    labelComponent: () => lcomp("22 Nov"),
  },

  {
    value: 320,

    labelComponent: () => lcomp("24 Nov"),
  },

  {
    value: 310,

    hideDataPoint: true,
  },

  {
    value: 270,
  },

  {
    value: 240,

    hideDataPoint: true,
  },

  {
    value: 130,

    labelComponent: () => lcomp("26 Nov"),
  },

  {
    value: 120,

    hideDataPoint: true,
  },

  {
    value: 100,
  },

  {
    value: 210,

    hideDataPoint: true,
  },

  {
    value: 270,

    labelComponent: () => lcomp("28 Nov"),
  },

  {
    value: 240,

    hideDataPoint: true,
  },

  {
    value: 120,

    hideDataPoint: true,
  },

  {
    value: 100,
  },

  {
    value: 210,

    labelComponent: () => lcomp("28 Nov"),
  },

  {
    value: 20,

    hideDataPoint: true,
  },

  {
    value: 100,
  },
];

const Home = () => {
  const { user, monthlyTransactions, wallet, expenses } = useAppContext();

  if (!user) return null;

  const recentTransactions = monthlyTransactions
    .sort(
      (a, b) =>
        convertToDate(b.date).getTime() - convertToDate(a.date).getTime()
    )
    .slice(0, 10);

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
        <View style={{ marginBottom: 20 }}>
          <LineChart
            areaChart
            curved
            isAnimated
            animateOnDataChange
            animationDuration={1500}
            onDataChangeAnimationDuration={300}
            thickness={3}
            noOfSections={1}
            color={colors.purple}
            yAxisColor="transparent"
            xAxisColor="transparent"
            hideYAxisText
            data={currentData}
            hideDataPoints
            startFillColor={colors.purple}
            endFillColor={colors.purple}
            startOpacity={0.5}
            endOpacity={0}
            spacing={24}
            backgroundColor="transparent"
            rulesColor="transparent"
            rulesType="solid"
            initialSpacing={10}
            pointerConfig={{
              pointerStripHeight: 100,
              pointerStripColor: "lightgray",
              pointerStripWidth: 2,
              pointerColor: "lightgray",
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: (items) => {
                return (
                  <View
                    style={{
                      height: 90,
                      width: 100,
                      justifyContent: "center",
                      marginTop: -30,
                      marginLeft: -40,
                    }}
                  >
                    <Text
                      style={{
                        color: "red",
                        fontSize: 14,
                        marginBottom: 6,
                        textAlign: "center",
                      }}
                    >
                      {items[0].date} ds
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderRadius: 16,
                        backgroundColor: "white",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "blue",
                        }}
                      >
                        {"$" + items[0].value + ".0"} ??
                      </Text>
                    </View>
                  </View>
                );
              },
            }}
          />
        </View>
        <View style={styles.transacCont}>
          <Transactions showFooter showTitle data={recentTransactions} />
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
