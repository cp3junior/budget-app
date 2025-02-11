import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AutoComplete from "../../components/common/AutoComplete";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListContent from "../../components/common/FormList/FormListContent";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import InputForm from "../../components/common/InputForm";
import ModalHeader from "../../components/common/ModalHeader";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_PRODUCTS } from "../../lib/constant";
import { updateDocument } from "../../lib/firebaseFirestore";
import { generateRandomString } from "../../lib/helpers";
import { colors } from "../../lib/theme";
import * as Yup from "yup";
import { Formik, FormikProps } from "formik";

const ProductPriceSchema = Yup.object().shape({
  amount: Yup.number().required("Required"),
  location: Yup.string().required("Required"),
});

const ProductPrice = () => {
  const params = useLocalSearchParams();
  const { user, products, locations } = useAppContext();
  const navigate = useNavigation();
  const formikRef = useRef<FormikProps<ProductPriceForm> | null>(null);

  const productId = params.productId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  if (!productId) return null;
  if (!user) return null;

  const currentProduct = products.find((prod) => prod.id === productId);
  if (!currentProduct) return null;

  const initialFormValues: ProductPriceForm = {
    amount: "",
    location: "",
  };

  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = () => {
    if (formikRef.current) {
      formikRef.current?.handleSubmit();
    }
  };

  const handleSubmit = async ({ amount, location }: ProductPriceForm) => {
    setIsLoading(true);
    const productPriceTest: ProductPrice = {
      id: generateRandomString(),
      amount,
      location,
      createdAt: date,
      date: new Date(),
    };

    const newPrices = [...currentProduct.prices, productPriceTest];
    await updateDocument(COLLECTION_PRODUCTS, productId, {
      prices: newPrices,
    });
    navigate.goBack();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader onPress={handleSave} title="Add" isLoading={isLoading} />
      <View style={styles.containerMain}>
        <Text style={styles.textStyle}>
          Enter the product price and location to keep track of your spending.
        </Text>
        <Formik
          innerRef={formikRef}
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          validationSchema={ProductPriceSchema}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <FormListContainer style={styles.textInputContainer}>
              <InputForm
                isInvalid={Boolean(errors?.amount && touched?.amount)}
                InputProps={{
                  placeholder: "Price",
                  value: values.amount,
                  onChangeText: handleChange("amount"),
                  onBlur: handleBlur("amount"),
                  type: "text",
                  blurOnSubmit: false,
                  keyboardType: "numeric",
                }}
              />
              <FormListSeparator />
              <AutoComplete
                isInvalid={Boolean(errors?.location && touched?.location)}
                suggestions={locations}
                zIndex={2}
                InputProps={{
                  placeholder: "Location",
                  value: values.location,
                  onChangeText: handleChange("location"),
                  onBlur: handleBlur("location"),
                  type: "text",
                  returnKeyType: "next",
                }}
              />
              <FormListSeparator />
              <FormListContent>
                <Text fontWeight="800" style={styles.flex}>
                  Date
                </Text>
                <View style={styles.datePickerContent}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={onChange}
                    themeVariant="dark"
                  />
                </View>
              </FormListContent>
            </FormListContainer>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    padding: 0,
    marginBottom: 40,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  flex: { flex: 1 },
  datePickerContent: { flexDirection: "row" },
  containerMain: {
    marginTop: 20,
  },
  textStyle: {
    marginBottom: 20,
    color: colors.grayLight,
  },
});

export default ProductPrice;
