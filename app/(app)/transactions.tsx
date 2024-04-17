import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";

const Transactions = () => {
  return (
    <SafeContainer>
      <Text>Transactions list</Text>
      <Text>Transactions Search, powerful filter, graph on top</Text>
    </SafeContainer>
  );
};

const TransactionsScreen = withTabBar(Transactions);

export default TransactionsScreen;
