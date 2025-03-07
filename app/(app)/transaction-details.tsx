import { View } from "react-native";
import React from "react";
import Text from "../../components/common/Text";
import SafeContainer from "../../components/common/SafeContainer";

const TransactionDetails = () => {
  return (
    <SafeContainer hasHeader>
      <View>
        <Text>TransactionDetails</Text>
      </View>
    </SafeContainer>
  );
};

export default TransactionDetails;
