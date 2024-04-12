import { View, Text } from "react-native";
import React from "react";
import withTabBar from "../../hoc/withTabBar";

const Budget = () => {
  return (
    <View>
      <Text>Budget</Text>
    </View>
  );
};

const BudgetScreen = withTabBar(Budget);

export default BudgetScreen;
