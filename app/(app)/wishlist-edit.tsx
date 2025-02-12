import { useNavigation } from "expo-router";
import { Formik, FormikProps } from "formik";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";
import AmountInput from "../../components/AmountInput";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListContent from "../../components/common/FormList/FormListContent";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import InputForm from "../../components/common/InputForm";
import ModalHeader from "../../components/common/ModalHeader";
import { useAppContext } from "../../hook/useAppContext";
import { categories, COLLECTION_WISHLISTS } from "../../lib/constant";
import { addDocument } from "../../lib/firebaseFirestore";

const WishlistSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
});

const WishlistEdit = () => {
  const { user } = useAppContext();
  const navigate = useNavigation();

  const amountInput = useRef<TextInput>(null);
  const descriptionInput = useRef<TextInput>(null);
  const formikRef = useRef<FormikProps<WhishlistForm> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [category, setCategory] = useState<DropdownItem>(
    categories[0]?.items?.[0] as DropdownItem
  );

  if (!user) return null;

  const initialFormValues: WhishlistForm = {
    name: "",
    description: "",
  };

  const handleCategoryChange = (item: DropdownItem) => {
    setCategory(item);
  };

  const focusDescription = () => {
    descriptionInput.current?.focus();
  };

  const handleSave = () => {
    if (formikRef.current) {
      formikRef.current?.handleSubmit();
    }
  };

  const handleSubmit = async ({ description, name }: WhishlistForm) => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }
    setInvalidAmount(false);
    setIsLoading(true);

    const data: WishListItemFirestore = {
      sharedAccounId: user.sharedAccounId,
      name,
      description,
      transactions: [],
      fullAmount: amount,
      amount: "",
      categoryId: category.id,
      completed: false,
      createdAt: new Date(),
    };

    await addDocument<WishListItemFirestore>(COLLECTION_WISHLISTS, data);

    navigate.goBack();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader onPress={handleSave} title="Add" isLoading={isLoading} />
      <AmountInput
        ref={amountInput}
        value={amount}
        onChange={setAmount}
        index={1}
        isInvalid={invalidAmount}
      />
      <Formik
        innerRef={formikRef}
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validationSchema={WishlistSchema}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <FormListContainer style={styles.textInputContainer}>
            <InputForm
              isInvalid={Boolean(errors?.name && touched?.name)}
              InputProps={{
                placeholder: "Name",
                value: values.name,
                onChangeText: handleChange("name"),
                onBlur: handleBlur("name"),
                onSubmitEditing: focusDescription,
                type: "text",
                returnKeyType: "next",
                blurOnSubmit: false,
              }}
            />
            <FormListSeparator />
            <InputForm
              ref={descriptionInput}
              isInvalid={Boolean(errors?.description && touched?.description)}
              InputProps={{
                placeholder: "Description",
                type: "text",
                returnKeyType: "next",
                value: values.description,
                onChangeText: handleChange("description"),
                onBlur: handleBlur("description"),
              }}
            />
            <FormListSeparator />
            <FormListContent>
              <DropDownMenu
                label="Category"
                id="category"
                value={category}
                onChange={handleCategoryChange}
                data={categories}
              />
            </FormListContent>
          </FormListContainer>
        )}
      </Formik>
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
});

export default WishlistEdit;
