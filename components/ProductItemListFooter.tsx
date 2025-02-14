import { StyleSheet, View } from "react-native";
import React from "react";
import Text from "./common/Text";
import { colors } from "../lib/theme";
import { formatDateSimple } from "../lib/dateHelpers";
import { convertToFloat } from "../lib/helpers";

interface ProductItemListFooterProps {
  product: ProductItem;
}
const ProductItemListFooter = ({ product }: ProductItemListFooterProps) => {
  let lowestPrice = "0";
  let lowestPriceDate = formatDateSimple(product.createdAt);

  if (product.prices.length > 0) {
    const lowestPriceProduct = product.prices.sort(
      (a, b) => convertToFloat(a.amount) - convertToFloat(b.amount)
    )[0];

    lowestPrice = lowestPriceProduct.amount;
    lowestPriceDate = formatDateSimple(lowestPriceProduct.date);
  }

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textInfo}>Lowest price: ${lowestPrice}</Text>
      <Text style={styles.textInfo}>{lowestPriceDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  textInfo: {
    color: colors.grayLight,
    fontSize: 14,
  },
});

export default ProductItemListFooter;
