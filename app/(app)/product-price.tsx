import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Formik, FormikProps } from "formik";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import AmountInput from "../../components/AmountInput";
import AutoComplete from "../../components/common/AutoComplete";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListContent from "../../components/common/FormList/FormListContent";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import ModalHeader from "../../components/common/ModalHeader";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import { COLLECTION_LOCATIONS, COLLECTION_PRODUCTS } from "../../lib/constant";
import { addDocument, updateDocument } from "../../lib/firebaseFirestore";
import { generateRandomString } from "../../lib/helpers";
import { colors } from "../../lib/theme";

const ProductPriceSchema = Yup.object().shape({
  location: Yup.string().required("Required"),
});

const ProductPrice = () => {
  const params = useLocalSearchParams();
  const { user, products, locations } = useAppContext();
  const navigate = useNavigation();
  const formikRef = useRef<FormikProps<ProductPriceForm> | null>(null);
  const amountInput = useRef<TextInput>(null);

  const [amount, setAmount] = useState("");
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const productId = params.productId as string;
  if (!productId) return null;
  if (!user) return null;

  const currentProduct = products.find((prod) => prod.id === productId);
  if (!currentProduct) return null;

  const initialFormValues: ProductPriceForm = {
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

  const handleSubmit = async ({ location }: ProductPriceForm) => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }
    setInvalidAmount(false);
    setIsLoading(true);

    const newLocationExists = locations.find(
      (loc) => loc.name.trim().toLowerCase() === location.trim().toLowerCase()
    );

    let locationId = "";

    if (!newLocationExists) {
      const dataLocation: LocationItemFirestore = {
        sharedAccounId: user.sharedAccounId,
        name: location.trim(),
        createdAt: new Date(),
      };
      locationId = await addDocument<LocationItemFirestore>(
        COLLECTION_LOCATIONS,
        dataLocation
      );
    } else {
      locationId = newLocationExists.id;
    }

    const productPriceTest: ProductPrice = {
      id: generateRandomString(),
      amount,
      locationId,
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
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <ModalHeader onPress={handleSave} title="Add" isLoading={isLoading} />
      <View style={styles.containerMain}>
        <View>
          <AmountInput
            ref={amountInput}
            value={amount}
            onChange={setAmount}
            index={1}
            isInvalid={invalidAmount}
          />
        </View>
        <Formik
          innerRef={formikRef}
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          validationSchema={ProductPriceSchema}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <FormListContainer style={styles.textInputContainer}>
              <AutoComplete
                isInvalid={Boolean(errors?.location && touched?.location)}
                suggestions={locations}
                zIndex={3}
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
                <Text style={styles.flex}>Date</Text>
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
        <Text style={styles.textStyle}>
          Enter the product price and location to keep track of your spending.
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    padding: 0,
    marginBottom: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  flex: { flex: 1, fontWeight: "800" },
  datePickerContent: { flexDirection: "row" },
  containerMain: {
    marginTop: 20,
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.grayLight,
    marginTop: -15,
    marginLeft: 20,
  },
});

export default ProductPrice;
