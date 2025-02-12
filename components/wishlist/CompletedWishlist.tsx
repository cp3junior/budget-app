import React from "react";
import { View } from "react-native";
import { useAppContext } from "../../hook/useAppContext";
import WishlistItems from "./WishlistItems";

const CompletedWishlist = () => {
  const { wishlists } = useAppContext();

  const completedWishlists = wishlists.filter((wishlist) => wishlist.completed);

  return (
    <View>
      <WishlistItems wishlists={completedWishlists} />
    </View>
  );
};

export default CompletedWishlist;
