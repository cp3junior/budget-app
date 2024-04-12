import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Button, ButtonText } from "@gluestack-ui/themed";

const TestScree = () => {
  return (
    <View>
      <Text>TestScree</Text>
      <Link href="/test" style={{ marginTop: 40 }}>
        <Text>Test</Text>
      </Link>
      <Button variant="link">
        <ButtonText>Test btn</ButtonText>
      </Button>
    </View>
  );
};

export default TestScree;
