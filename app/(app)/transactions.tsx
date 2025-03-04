import { Stack } from "expo-router";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";

const Transactions = () => {
  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          headerTitle: "Transaction history",
        }}
      />
      <Text>Transactions list ds</Text>
      <Text>Transactions Search, powerful filter, graph on top</Text>
    </SafeContainer>
  );
};

export default Transactions;
