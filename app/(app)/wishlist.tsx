import { StyleSheet, TouchableOpacity, View } from "react-native";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import withTabBar from "../../hoc/withTabBar";
import SFSymbol from "sweet-sfsymbols";
import { colors } from "../../lib/theme";
import HeaderTitle from "../../components/HeaderTitle";
import { useRouter } from "expo-router";

const Wishlist = () => {
  const router = useRouter();

  const navigateToAddWishlist = () => {
    router.push("/wishlist-edit");
  };
  return (
    <SafeContainer>
      <HeaderTitle
        title="Wishlist"
        hasButton
        onPressButton={navigateToAddWishlist}
      />
      <View>
        <Text>Total Amount</Text>
        <Text>$1,802.23</Text>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  textTitle: { flex: 1, textAlign: "center", fontSize: 20 },
  addBtn: {
    position: "absolute",
    right: 0,
  },
});

const WishlistScreen = withTabBar(Wishlist);

export default WishlistScreen;
