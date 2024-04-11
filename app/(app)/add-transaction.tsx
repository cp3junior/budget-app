import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const AddTransaction = () => {
  return (
    <View>
      <Text>AddTransaction</Text>
      <Link href="../">Go Back</Link>
    </View>
  );
};

export default AddTransaction;
