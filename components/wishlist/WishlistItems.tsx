import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React, { Fragment } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_WALLETS, COLLECTION_WISHLISTS } from "../../lib/constant";
import { deleteDocument, updateDocument } from "../../lib/firebaseFirestore";
import {
  calculateRemaining,
  calculateRemainingPercent,
  capitalize,
  convertToFloat,
  formatCurrency,
  getCategoryByCategoryId,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";
import FormListContainer from "../common/FormList/FormListContainer";
import FormListSeparator from "../common/FormList/FormListSeparator";
import Text from "../common/Text";

interface WishlistItemsProps {
  wishlists: WishListItem[];
}
const WishlistItems = ({ wishlists }: WishlistItemsProps) => {
  const router = useRouter();
  const { wallet } = useAppContext();

  if (!wallet) return null;

  const navigateToDetails = (id: string) => {
    router.push({
      pathname: "/wishlist-details",
      params: { wishlistId: id },
    });
  };

  const showDeletePrompt = (wishlist: WishListItem) => {
    let message = "Are you sure you want to delete this?";
    if (!wishlist.completed) {
      message +=
        "\n\n⚠️ This wishlist isn't fully paid. Any paid balance will be refunded to your wallet.";
    }
    Alert.alert("Delete wishlist", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(wishlist),
        style: "destructive",
      },
    ]);
  };

  const handleDelete = async (wishlist: WishListItem) => {
    if (!wishlist.completed) {
      const amount = convertToFloat(wishlist.amount);
      if (amount > 0) {
        const walletAmount = convertToFloat(wallet.amount);
        const newAmount = `${walletAmount + amount}`;
        await updateDocument(COLLECTION_WALLETS, wallet.id, {
          amount: newAmount,
        });
      }
    }
    await deleteDocument(COLLECTION_WISHLISTS, wishlist.id);
  };

  return (
    <FormListContainer style={styles.containerStyle}>
      {wishlists.map((wish, index) => {
        const showSeparator: boolean = wishlists.length !== index + 1;
        const isCompleted = wish.completed;
        const remainingAmount = calculateRemaining(
          wish.fullAmount,
          wish.amount
        );
        const remainingPercent = calculateRemainingPercent(
          wish.fullAmount,
          wish.amount
        );

        const category = getCategoryByCategoryId(wish.categoryId);

        return (
          <Fragment key={wish.id}>
            <TouchableOpacity
              style={styles.container}
              onPress={() => navigateToDetails(wish.id)}
              onLongPress={() => showDeletePrompt(wish)}
            >
              <View style={styles.containerLeft}>
                <SFSymbol
                  weight="regular"
                  size={17}
                  name={category?.icon ? category.icon : "questionmark"}
                  colors={[colors.grayLight]}
                />
              </View>
              <View style={styles.containerRight}>
                <View style={styles.containerTop}>
                  <View>
                    <Text style={styles.styleText}>{wish.name}</Text>
                    {isCompleted ? (
                      <Text style={styles.styleSubText}>
                        Paid {formatCurrency(wish.fullAmount)}
                      </Text>
                    ) : (
                      <Text style={styles.styleSubText}>
                        {remainingAmount} remaining from{" "}
                        {formatCurrency(wish.fullAmount)}
                      </Text>
                    )}
                    {category && (
                      <Text
                        style={{
                          ...styles.categoryText,
                          ...{ fontWeight: "200" },
                        }}
                      >
                        {capitalize(category.label)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.containerChevron}>
                    <SFSymbol
                      weight="regular"
                      size={14}
                      name="chevron.right"
                      colors={[colors.grayLight]}
                    />
                  </View>
                </View>
                {!isCompleted && (
                  <View style={styles.containerProgress}>
                    <Progress value={remainingPercent} size="xs">
                      <ProgressFilledTrack bgColor={colors.purple} />
                    </Progress>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            {showSeparator && (
              <View style={styles.containerSeparator}>
                <FormListSeparator />
              </View>
            )}
          </Fragment>
        );
      })}
    </FormListContainer>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
  },
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingRight: 10,
    alignItems: "center",
  },
  containerLeft: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 10,
  },
  containerRight: {
    flex: 1,
  },
  containerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  styleText: {
    color: colors.white,
    fontSize: 20,
    marginBottom: 3,
    fontWeight: "900",
  },
  styleSubText: {
    color: colors.grayLight,
    fontSize: 16,
    fontWeight: "600",
  },
  containerChevron: {
    marginLeft: 10,
  },
  containerProgress: {
    marginTop: 10,
  },
  containerSeparator: {
    paddingLeft: 50,
  },
  categoryText: {
    color: colors.grayLight,
    fontSize: 14,
    marginTop: 2,
  },
});

export default WishlistItems;
