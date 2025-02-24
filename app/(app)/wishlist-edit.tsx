import { useLocalSearchParams, useNavigation } from "expo-router";
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
import {
  categories,
  COLLECTION_WALLETS,
  COLLECTION_WISHLISTS,
} from "../../lib/constant";
import { addDocument, updateDocument } from "../../lib/firebaseFirestore";
import { convertToFloat, getCategoryByCategoryId } from "../../lib/helpers";

const WishlistSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
});

const WishlistEdit = () => {
  const { user, wishlists, wallet } = useAppContext();
  const navigate = useNavigation();
  const params = useLocalSearchParams();

  const wishlistId = (params.wishlistId as string) || "";
  const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);

  const initialFormValues: WhishlistForm = {
    name: currentWishlist?.name || "",
    description: currentWishlist?.description || "",
  };

  let initialCategory = categories[0]?.items?.[0] as DropdownItem;

  if (currentWishlist) {
    const category = getCategoryByCategoryId(currentWishlist.categoryId);
    if (category) initialCategory = category;
  }

  const amountInput = useRef<TextInput>(null);
  const descriptionInput = useRef<TextInput>(null);
  const formikRef = useRef<FormikProps<WhishlistForm> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(currentWishlist?.fullAmount || "");
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [category, setCategory] = useState<DropdownItem>(initialCategory);

  if (!user) return null;
  if (!wallet) return null;

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

  const handleSubmit = (values: WhishlistForm) => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }
    setInvalidAmount(false);

    if (wishlistId) editWishlist(values);
    else addWishlist(values);
  };

  const addWishlist = async ({ description, name }: WhishlistForm) => {
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

  const editWishlist = async ({ description, name }: WhishlistForm) => {
    if (!currentWishlist) return;
    setIsLoading(true);

    let completed = false;

    const intOldAmount = convertToFloat(currentWishlist.fullAmount);
    const intPaidAmount = convertToFloat(currentWishlist.amount);
    const intNewAmount = convertToFloat(amount);

    if (intNewAmount < intOldAmount) {
      if (intNewAmount < intPaidAmount) {
        completed = true;
        const difference = intPaidAmount - intNewAmount;
        const walletAmount = convertToFloat(wallet.amount);
        const newAmount = `${walletAmount + difference}`;
        await updateDocument(COLLECTION_WALLETS, wallet.id, {
          amount: newAmount,
        });
      }
    }

    const dataUpdate = {
      name,
      description,
      fullAmount: amount,
      categoryId: category.id,
      completed,
    };

    await updateDocument(COLLECTION_WISHLISTS, currentWishlist.id, dataUpdate);

    navigate.goBack();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader
        onPress={handleSave}
        title={wishlistId ? "Save" : "Add"}
        isLoading={isLoading}
      />
      <AmountInput
        ref={amountInput}
        value={amount}
        onChange={setAmount}
        index={0}
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
