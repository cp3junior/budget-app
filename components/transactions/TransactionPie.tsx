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
}

const TransactionPie = ({ transactions }: TransactionPieProps) => {
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
        radius={90}
        innerRadius={60}
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
                  <Text style={styles.txtPercentage}>
                    {currentData.percentage}%
                  </Text>
                  <Text style={styles.txtPrice}>
                    {formatCurrency(currentData.value)}
                  </Text>
                  <Text style={styles.txtLabel}>{currentData.label}</Text>
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
    fontSize: 18,
    color: colors.white,
    fontWeight: "900",
    textAlign: "center",
  },
  txtPrice: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
  txtLabel: { fontSize: 18, color: colors.grayLight, textAlign: "center" },
  txtCenterCont: { justifyContent: "center", alignItems: "center" },
  container: { padding: 10, alignItems: "center" },
});

export default TransactionPie;
