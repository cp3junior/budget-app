import { Stack } from "expo-router";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import HeaderTitle from "../../components/HeaderTitle";

const Transactions = () => {
  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => <HeaderTitle title="Transactions" />,
        }}
      />
      <Text>Transactions list</Text>
      <Text>Transactions Search, powerful filter, graph on top</Text>
    </SafeContainer>
  );
};

const TransactionsScreen = withTabBar(Transactions);

export default TransactionsScreen;
