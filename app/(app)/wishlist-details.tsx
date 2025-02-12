import { StyleSheet, View } from "react-native";
import React from "react";
import Text from "../../components/common/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppContext } from "../../hook/useAppContext";
import SafeContainer from "../../components/common/SafeContainer";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import { colors } from "../../lib/theme";

const WishlistDetails = () => {
  const { wishlists } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();

  const wishlistId = params.wishlistId as string;
  if (!wishlistId) return null;

  const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);
  if (!currentWishlist) return null;

  const navigateToAddTransaction = () => {
    router.push("/add-transaction");
  };

  const handleEditWishlist = () => {
    router.push("/wishlist-edit");
  };

  return (
    <SafeContainer
      hasHeader
      footerView={
        !currentWishlist.completed && (
          <View style={styles.containerBtns}>
            <View style={styles.footerCOntainer}>
              <FormListContainer style={styles.containerStyle}>
                <FormListButtonLink
                  label="Edit"
                  hasIcon={false}
                  color={colors.blue}
                  textStyle={{ ...styles.textStyle, ...{ fontWeight: "500" } }}
                  onPress={handleEditWishlist}
                />
              </FormListContainer>
            </View>
            <View style={[styles.footerCOntainer, { flex: 2 }]}>
              <FormListContainer style={styles.containerStyle}>
                <FormListButtonLink
                  label="Make a payment"
                  hasIcon={false}
                  color={colors.green}
                  textStyle={styles.textStyle}
                  onPress={navigateToAddTransaction}
                />
              </FormListContainer>
            </View>
          </View>
        )
      }
    >
      <View>
        <Text>WishlistDetails</Text>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  footerCOntainer: {
    height: 110,
    flex: 1,
  },
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  textStyle: { textAlign: "center", fontWeight: "900" },
  containerBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
});

export default WishlistDetails;
