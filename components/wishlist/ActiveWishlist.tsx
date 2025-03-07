import React from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useAppContext } from "../../hook/useAppContext";
import {
  calculateRemainingPercent,
  convertToFloat,
  formatCurrency,
} from "../../lib/helpers";
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

  const remaining = totalAmount - totalPaid;

  const remainingPercent = calculateRemainingPercent(
    totalAmount.toString(),
    totalPaid.toString()
  );

  return (
    <View>
      <View style={styles.cont}>
        <View style={styles.containerText}>
          <Text style={styles.textTitle}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.textSubTitle}>Total balance</Text>
        </View>
        <View>
          <AnimatedCircularProgress
            size={150}
            width={10}
            lineCap="round"
            fill={remainingPercent}
            tintColor={colors.purple}
            backgroundColor={colors.gray}
            arcSweepAngle={280}
            rotation={220}
          >
            {() => (
              <View style={styles.progressViewCont}>
                <Text style={styles.progressText}>Paid to date</Text>
                <Text
                  style={{
                    ...styles.progressPrice,
                    ...{ color: colors.green },
                  }}
                >
                  {formatCurrency(totalPaid)}
                </Text>
                <View style={styles.progressSeparator} />
                <Text
                  style={{
                    ...styles.progressPrice,
                    ...{ color: colors.red },
                  }}
                >
                  {formatCurrency(remaining)}
                </Text>
                <Text style={styles.progressText}>Remaining</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <WishlistItems wishlists={activeWishlists} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerText: {
    marginTop: 20,
    marginBottom: 40,
    flex: 1,
    alignItems: "center",
  },
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
  cont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  progressViewCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: colors.grayLight,
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: 11,
  },
  progressPrice: {
    fontSize: 21,
    fontWeight: "900",
  },
  progressSeparator: {
    height: 1,
    width: 35,
    backgroundColor: colors.grayLight,
    marginVertical: 5,
  },
});

export default ActiveWishlist;
