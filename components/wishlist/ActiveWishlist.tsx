import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppContext } from "../../hook/useAppContext";
import { convertToFloat, formatCurrency } from "../../lib/helpers";
import { colors } from "../../lib/theme";
import Text from "../common/Text";
import WishlistItems from "./WishlistItems";

const ActiveWishlist = () => {
  const { wishlists } = useAppContext();

  const activeWishlists = wishlists.filter((wishlist) => !wishlist.completed);

  const totalAmount = activeWishlists.reduce((acc, curr) => {
    return acc + convertToFloat(curr.fullAmount);
  }, 0);
  const totalPaid = activeWishlists.reduce((acc, curr) => {
    return acc + convertToFloat(curr.amount);
  }, 0);

  const balance = totalAmount - totalPaid;

  return (
    <View>
      <View style={styles.containerText}>
        <Text style={styles.textTitle}>{formatCurrency(balance)}</Text>
        <Text style={styles.textSubTitle}>Total balance</Text>
      </View>
      <WishlistItems wishlists={activeWishlists} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row" },
  containerText: { marginTop: 20, marginBottom: 40 },
  textTitle: {
    textAlign: "center",
    fontSize: 54,
    fontWeight: "900",
    color: colors.blue,
  },
  textSubTitle: { textAlign: "center", fontSize: 18, color: colors.grayLight },
  addBtn: {
    position: "absolute",
    right: 0,
  },
});

export default ActiveWishlist;
