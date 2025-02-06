import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";

const Wishlist = () => {
  return (
    <SafeContainer>
      <Text>Wishlist</Text>
    </SafeContainer>
  );
};

const WishlistScreen = withTabBar(Wishlist);

export default WishlistScreen;
