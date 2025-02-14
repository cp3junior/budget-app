import { Stack, useRouter } from "expo-router";
import { Fragment, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import HeaderAddButton from "../../components/common/HeaderAddButton";
import SafeContainer from "../../components/common/SafeContainer";
import Text from "../../components/common/Text";
import ProductItemListFooter from "../../components/ProductItemListFooter";
import SearchComponent from "../../components/SearchComponent";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_PRODUCTS } from "../../lib/constant";
import { addDocument, deleteDocument } from "../../lib/firebaseFirestore";
import { colors } from "../../lib/theme";

const ProductsScreen = () => {
  const router = useRouter();
  const { products, user } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  if (!user) return null;

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
          onPress: (text: string | undefined) => handleAdd(text),
          style: "default",
          isPreferred: true,
        },
      ],
      "plain-text",
      defaultValue
    );
  };

  const handleShowAddPrompt = () => {
    showPrompt("", "Enter the product name.");
  };

  const showDeletePrompt = (product: ProductItem) => {
    Alert.alert("Delete product", "Are you sure you want to delete this?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDelete(product),
        style: "destructive",
      },
    ]);
  };

  const handleDelete = async (product: ProductItem) => {
    setIsLoading(true);
    await deleteDocument(COLLECTION_PRODUCTS, product.id);
    setIsLoading(false);
  };

  const handleAdd = async (text: string | undefined) => {
    if (!text) return;
    if (!text.trim()) return;
    setIsLoading(true);

    const fountExisting = products.find(
      (prod) => prod.name.trim() === text.trim()
    );
    if (fountExisting) {
      showPrompt(text, "Product already exists.");
      setIsLoading(false);
      return;
    }

    const data: ProductItemFirestore = {
      sharedAccounId: user.sharedAccounId,
      name: text.trim(),
      prices: [],
      createdAt: new Date(),
    };
    await addDocument<ProductItemFirestore>(COLLECTION_PRODUCTS, data);

    setIsLoading(false);
  };

  const navigateToDetails = (id: string) => {
    router.push({
      pathname: "/product-details",
      params: { productId: id },
    });
  };

  const sortedProducts = products.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  const filteredProducts = sortedProducts.filter((prod) =>
    prod.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderAddButton
              isLoading={isLoading}
              onPress={handleShowAddPrompt}
            />
          ),
        }}
      />
      <SearchComponent onSearch={setSearch} searchText={search} />
      <Text style={styles.textInfo}>
        Products are the items you buy regularly. This list helps you keep track
        of the prices quickly.
      </Text>
      <Text style={styles.textInfoDisc}>
        Press or hold one product to View/Edit or Delete.
      </Text>
      <View style={styles.container}>
        <FormListContainer style={styles.containerStyle}>
          {filteredProducts.map((prod, index) => {
            const showSeparator: boolean =
              filteredProducts.length !== index + 1;
            return (
              <Fragment key={prod.id}>
                <FormListButtonLink
                  textStyle={{ fontWeight: "700" }}
                  label={prod.name}
                  href=""
                  onPress={() => navigateToDetails(prod.id)}
                  onLongPress={() => showDeletePrompt(prod)}
                  footerNode={<ProductItemListFooter product={prod} />}
                />
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
  containerStyle: {
    padding: 0,
    flex: 1,
    marginBottom: 30,
  },
  container: { flex: 1, marginBottom: 60 },
  textInfo: {
    color: colors.grayLight,
    marginBottom: 10,
    fontSize: 16,
  },
  textInfoDisc: {
    color: colors.grayLight,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProductsScreen;
