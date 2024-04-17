import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";

const Budget = () => {
  return (
    <SafeContainer>
      <Text>Add Budget</Text>
      <Text>List Budgets with dates</Text>
    </SafeContainer>
  );
};

const BudgetScreen = withTabBar(Budget);

export default BudgetScreen;
