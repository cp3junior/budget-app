import React, { useEffect, useState } from "react";

import { Spinner } from "@gluestack-ui/themed";
import { format, parseISO } from "date-fns";
import { Stack } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart, lineDataItem } from "react-native-gifted-charts";
import HeaderTitle from "../../components/HeaderTitle";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import TransactionPie from "../../components/transactions/TransactionPie";
import withTabBar from "../../hoc/withTabBar";
import { COLLECTION_TRANSACTIONS } from "../../lib/constant";
import {
  generateSixMonthListDropdown,
  getIntervalMonthDropdown,
  getMonthDropdown,
  groupTransactionByMonth,
} from "../../lib/dateHelpers";
import { fetchDocuments } from "../../lib/firebaseFirestore";
import { convertToFloat, formatCurrency } from "../../lib/helpers";
import { colors } from "../../lib/theme";

const screenHeight = Dimensions.get("window").height;
const monthsDropDown = generateSixMonthListDropdown(new Date());
const currentMonthDefault = getMonthDropdown(new Date());

const Analytics = () => {
  const [currentMonth, setCurrentMonth] =
    useState<DropdownItem>(currentMonthDefault);
  const [groupedTransactions, setGroupedTransactions] = useState<
    GroupedTransactions[]
  >([]);
  const [groupedTransaction, setGroupedTransaction] =
    useState<GroupedTransactions | null>(null);
  const [graphData, setGraphData] = useState<lineDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [start, end] = getIntervalMonthDropdown(monthsDropDown);
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
      const groupedTransactions = groupTransactionByMonth(
        newTransactions,
        monthsDropDown
      );
      setGroupedTransactions(groupedTransactions);

      const currentMonth = currentMonthDefault.value as string;
      const found = groupedTransactions.find((v) => v.id === currentMonth);
      if (found) setGroupedTransaction(found);

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
          transactions: transaction.data,
        };
        dataGraph.push(dataItem);
      }
      setGraphData(dataGraph);

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleMonthChange = async (item: DropdownItem) => {
    const currentMonth = item.value as string;
    const found = groupedTransactions.find((v) => v.id === currentMonth);
    if (found) setGroupedTransaction(found);
    setCurrentMonth(item);
  };

  if (isLoading)
    return (
      <View style={styles.loadCont}>
        <Spinner color={colors.blue} />
      </View>
    );

  const maxValue = Math.max(...graphData.map((item) => item.value || 0));

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => <HeaderTitle title="Analytics" />,
        }}
      />
      {graphData.length > 0 && (
        <View>
          <BarChart
            isAnimated
            data={graphData}
            initialSpacing={10}
            spacing={20}
            barWidth={33}
            barBorderRadius={4}
            maxValue={maxValue + 130}
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
      <View>
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
        {groupedTransaction && groupedTransaction.data.length > 0 && (
          <TransactionPie transactions={groupedTransaction.data} />
        )}
      </View>
      <Text style={styles.textClaim}>
        This is the analytics of your transactions over the past 6 months. The
        more you use the app, the clearer your spending patterns become. Explore
        the graph to gain deeper insights and interact with it for more details
        on your expenses.
      </Text>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  textClaim: {
    color: colors.grayLight,
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  containerDropdown: { alignItems: "center", marginBottom: 10, marginTop: 20 },
  labelStyle: { fontWeight: "900", color: colors.grayLight },
  loadCont: {
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
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
});

const LabelComponent = (val: string) => {
  const date = parseISO(val);
  const value = format(date, "MMMM");

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

const AnalyticsScreen = withTabBar(Analytics);

export default AnalyticsScreen;
