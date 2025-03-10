import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import {
  formatCurrency,
  getGroupedTransactionsByCategory,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";
import Text from "../common/Text";

interface TransactionPieProps {
  transactions: TransactionItem[];
  isSmall?: boolean;
}

const TransactionPie = ({ transactions, isSmall }: TransactionPieProps) => {
  const [currentData, setCurrentData] = useState<PieItem | null>(null);
  const [data, setData] = useState<PieItem[]>([]);

  useEffect(() => {
    const groupedData = getGroupedTransactionsByCategory(transactions);
    if (groupedData.length > 0) setCurrentData(groupedData[0]);
    setData(groupedData);
  }, [transactions]);

  const handlePress = (item: PieItem) => {
    setCurrentData(item);
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        donut
        showGradient
        sectionAutoFocus
        radius={isSmall ? 60 : 90}
        innerRadius={isSmall ? 40 : 60}
        innerCircleColor={colors.darker}
        showText
        isAnimated
        focusOnPress
        onPress={handlePress}
        centerLabelComponent={() => {
          return (
            <View style={styles.txtCenterCont}>
              {currentData && (
                <View>
                  <Text
                    style={{
                      ...styles.txtPercentage,
                      ...{ fontSize: isSmall ? 16 : 20 },
                    }}
                  >
                    {currentData.percentage}%
                  </Text>
                  <Text
                    style={{
                      ...styles.txtPrice,
                      ...{ fontSize: isSmall ? 16 : 18 },
                    }}
                  >
                    {formatCurrency(currentData.value)}
                  </Text>
                  <Text
                    style={{
                      ...styles.txtLabel,
                      ...{ fontSize: isSmall ? 13 : 16 },
                    }}
                  >
                    {currentData.label}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        showTooltip={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  txtPercentage: {
    color: colors.blue,
    fontWeight: "900",
    textAlign: "center",
  },
  txtPrice: {
    color: colors.white,
    fontWeight: "900",
    textAlign: "center",
  },
  txtLabel: { color: colors.grayLight, textAlign: "center" },
  txtCenterCont: { justifyContent: "center", alignItems: "center" },
  container: { padding: 10, alignItems: "center" },
});

export default TransactionPie;
