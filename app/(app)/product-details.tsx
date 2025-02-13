import { Spinner } from "@gluestack-ui/themed";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { Fragment, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import HeaderAddButton from "../../components/common/HeaderAddButton";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_PRODUCTS } from "../../lib/constant";
import { formatDateSimple } from "../../lib/dateHelpers";
import { updateDocument } from "../../lib/firebaseFirestore";
import { colors } from "../../lib/theme";

const ProductDetails = () => {
  const { user, products, locations } = useAppContext();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const productId = params.productId as string;
  if (!productId) return null;
  if (!user) return null;

  const currentProduct = products.find((prod) => prod.id === productId);
  if (!currentProduct) return null;

  const showPrompt = (defaultValue: string, message: string) => {
    Alert.prompt(
      "Product",
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: (text: string | undefined) => handleEdit(text),
          style: "default",
          isPreferred: true,
        },
      ],
      "plain-text",
      defaultValue
    );
  };

  const handleShowEditPrompt = () => {
    showPrompt(currentProduct.name, "Edit product.");
  };

  const handleEdit = async (text: string | undefined) => {
    if (!text) return;
    if (!text.trim()) return;
    setIsLoading(true);

    await updateDocument(COLLECTION_PRODUCTS, currentProduct.id, {
      name: text.trim(),
    });
    setIsLoading(false);
  };

  const navigateToAddPrice = () => {
    router.push({
      pathname: "/product-price",
      params: { productId },
    });
  };

  const showDeletePrompt = (priceId: string) => {
    Alert.alert("Delete price", "Are you sure you want to delete this?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(priceId),
        style: "destructive",
      },
    ]);
  };

  const handleDelete = async (priceId: string) => {
    setIsLoading(true);
    const newPrices = currentProduct.prices.filter((pr) => pr.id !== priceId);

    await updateDocument(COLLECTION_PRODUCTS, currentProduct.id, {
      prices: newPrices,
    });
    setIsLoading(false);
  };

  const getLocationName = (locationId: string): string => {
    const location = locations.find((loc) => loc.id === locationId);
    return location?.name ?? "";
  };

  return (
    <SafeContainer
      hasHeader
      footerView={
        <View style={styles.footerCOntainer}>
          <FormListContainer style={styles.containerStyle}>
            {isLoading ? (
              <Spinner
                style={{
                  marginTop: 15,
                }}
                color={colors.blue}
              />
            ) : (
              <FormListButtonLink
                label="Edit product name"
                hasIcon={false}
                color={colors.blue}
                textStyle={styles.textStyle}
                onPress={handleShowEditPrompt}
              />
            )}
          </FormListContainer>
        </View>
      }
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderAddButton
              isLoading={isLoading}
              onPress={navigateToAddPrice}
            />
          ),
        }}
      />
      <View style={styles.contentScroll}>
        <Text style={styles.textTitle}>{currentProduct.name}</Text>
        <Text style={styles.textSUbTitle}>
          Track product prices effortlessly by adding notes with price details
          and the store location. Keep a record of where and how much you paid
          to make smarter shopping decisions!
        </Text>
        <FormListContainer style={styles.containerStyleList}>
          {currentProduct.prices.map((price, index) => {
            const showSeparator: boolean =
              currentProduct.prices.length !== index + 1;
            return (
              <Fragment key={price.id}>
                <View style={styles.containerList}>
                  <View style={styles.containerListLeft}>
                    <View>
                      <Text style={styles.containerListText}>
                        {getLocationName(price.locationId)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => showDeletePrompt(price.id)}
                    >
                      <SFSymbol
                        weight="thin"
                        size={22}
                        name="trash.circle"
                        colors={[colors.redVivid]}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.containerListRight}>
                    <Text style={styles.containerListSubTextPrice}>
                      Price:{" "}
                      {<Text style={styles.textPrice}>${price.amount}</Text>}
                    </Text>
                    <Text style={styles.containerListSubText}>
                      {formatDateSimple(price.date)}
                    </Text>
                  </View>
                </View>

                {showSeparator && <FormListSeparator />}
              </Fragment>
            );
          })}
        </FormListContainer>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    marginBottom: 30,
  },
  containerStyleList: {
    padding: 0,
    flex: 1,
    marginBottom: 30,
  },
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  footerCont: {
    flexDirection: "row",
    gap: 20,
  },
  footerCOntainer: {
    height: 110,
  },
  textStyle: { textAlign: "center" },
  textTitle: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "900",
  },
  textSUbTitle: {
    color: colors.grayLight,
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "600",
  },
  containerList: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  containerListLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerListRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  containerListText: {
    fontSize: 17,
    fontWeight: "700",
  },
  containerListSubTextPrice: {
    fontSize: 14,
    color: colors.grayLight,
    marginTop: -2,
    fontWeight: "700",
  },
  containerListSubText: {
    fontSize: 14,
    color: colors.grayLight,
  },
  textPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  contentScroll: {
    marginBottom: 60,
  },
});

export default ProductDetails;
