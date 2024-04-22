import { StyleSheet, View } from "react-native";
import { Fragment, useState } from "react";
import Text from "../../components/common/Text";
import SafeContainer from "../../components/common/SafeContainer";
import { Stack } from "expo-router";
import HeaderAddButton from "../../components/common/HeaderAddButton";
import DialogEdit from "../../components/common/DialogEdit";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListButtonLink from "../../components/common/FormList/FormListButtonLink";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";

const products = [
  "Diapers",
  "Biscuit",
  "Cookie",
  "Chocolate",
  "Milk",
  "Rice",
  "Sauce",
  "Sugar",
  "Salt",
  "Fish",
  "Salmon",
];

const ProductsScreen = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderAddButton onPress={handleShow} />,
        }}
      />
      <DialogEdit title="Edit Product" show={show} onClose={handleClose} />
      <View style={styles.container}>
        <FormListContainer style={styles.containerStyle}>
          {products.map((loc, index) => {
            const canShow: boolean = products.length !== index + 1;
            return (
              <Fragment key={loc}>
                <FormListButtonLink label={loc} href="" onPress={handleShow} />
                {canShow && <FormListSeparator />}
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
});

export default ProductsScreen;
