import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import SafeContainer from "../../components/common/SafeContainer";
import HeaderTitle from "../../components/HeaderTitle";
import ActiveWishlist from "../../components/wishlist/ActiveWishlist";
import CompletedWishlist from "../../components/wishlist/CompletedWishlist";
import withTabBar from "../../hoc/withTabBar";
import { activeTabsValues } from "../../lib/constant";

const Wishlist = () => {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const navigateToAddWishlist = () => {
    router.push("/wishlist-edit");
  };

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => (
            <HeaderTitle
              onPressButton={navigateToAddWishlist}
              hasButton
              title="Wishlist"
            />
          ),
        }}
      />
      <SegmentedControl
        style={{ marginTop: 10, marginBottom: 30 }}
        appearance="dark"
        values={activeTabsValues}
        selectedIndex={index}
        onChange={(event) => {
          setIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {index === 0 ? <ActiveWishlist /> : <CompletedWishlist />}
    </SafeContainer>
  );
};

const WishlistScreen = withTabBar(Wishlist);

export default WishlistScreen;
