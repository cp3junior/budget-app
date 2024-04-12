import { View, Text } from "react-native";
import React from "react";
import withTabBar from "../../hoc/withTabBar";

const Transactions = () => {
  return (
    <View>
      <Text>Transactions</Text>
    </View>
  );
};

const TransactionsScreen = withTabBar(Transactions);

export default TransactionsScreen;
