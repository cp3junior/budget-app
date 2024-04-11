import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const TestScree = () => {
  return (
    <View>
      <Text>TestScree</Text>
      <Link href="/test" style={{ marginTop: 40 }}>
        <Text>Test</Text>
      </Link>
    </View>
  );
};

export default TestScree;
