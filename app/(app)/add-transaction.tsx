import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AmountInput from "../../components/AmountInput";
import AutoComplete from "../../components/common/AutoComplete";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListContent from "../../components/common/FormList/FormListContent";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import InputForm from "../../components/common/InputForm";
import ModalHeader from "../../components/common/ModalHeader";
import Text from "../../components/common/Text";
import { useAppContext } from "../../hook/useAppContext";
import {
  categories,
  COLLECTION_LOCATIONS,
  COLLECTION_TRANSACTIONS,
  COLLECTION_WALLETS,
  COLLECTION_WISHLISTS,
  transactionDirections,
  transactionTypes,
} from "../../lib/constant";
import { addDocument, updateDocument } from "../../lib/firebaseFirestore";
import {
  calculateRemainingRaw,
  convertToFloat,
  getCategoryByCategoryId,
} from "../../lib/helpers";

const AddTransactionScreen = () => {
  const { user, locations, wallet, wishlists } = useAppContext();
  const navigate = useNavigation();
  const params = useLocalSearchParams();

  const wishlistId = (params.wishlistId as string) || "";
  const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);

  let initialAmount = "";
  let initialCategory = categories[0]?.items?.[0] as DropdownItem;

  if (currentWishlist) {
    initialAmount = calculateRemainingRaw(
      currentWishlist.fullAmount,
      currentWishlist.amount
    );

    const category = getCategoryByCategoryId(currentWishlist.categoryId);
    if (category) initialCategory = category;
  }

  let buttonTitle = "Add";
  if (wishlistId) buttonTitle = "Pay";

  const notesInput = useRef<TextInput>(null);
  const locationInput = useRef<TextInput>(null);
  const amountInput = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);
  const [transactionDirection, setTransactionDirection] = useState(0);
  const [amount, setAmount] = useState(initialAmount);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [category, setCategory] = useState<DropdownItem>(initialCategory);
  const [transactionType, setTransactionType] = useState<DropdownItem>(
    transactionTypes[0]
  );

  if (!user) return null;
  if (!wallet) return null;

  const onChange = (selectedDate: Date | undefined, name: string) => {
    if (selectedDate) {
      if (name === "date") setDate(selectedDate);
      if (name === "time") setTime(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (wishlistId) {
      handleSaveWishlist();
      return;
    }

    handleSaveRegular();
  };

  const handleSaveWishlist = async () => {
    if (currentWishlist) {
      if (!amount) {
        setInvalidAmount(true);
        amountInput.current?.focus();
        return;
      }
      const intAmount = convertToFloat(amount);
      const intWishlistAmount = convertToFloat(currentWishlist.amount);
      const intLimitAmount = convertToFloat(initialAmount);
      const intWallet = convertToFloat(wallet.amount);

      const newAmount = intWallet - intAmount;

      if (intAmount > intLimitAmount) {
        alert(`You have exceeded the remaining balance of $${initialAmount}.`);
        setInvalidAmount(true);
        amountInput.current?.focus();
        return;
      }

      setInvalidAmount(false);
      setLoading(true);

      const data: TransactionItemFirestore = {
        userId: user.id,
        sharedAccounId: user.sharedAccounId,
        amount,
        categoryId: category.id,
        transactionTypeId: transactionType.id,
        transactionDirection,
        description,
        locationId: "",
        date,
        time,
        createdAt: new Date(),
        origin: "wishlist",
        archived: false,
      };

      const transactionId = await addDocument<TransactionItemFirestore>(
        COLLECTION_TRANSACTIONS,
        data
      );

      await updateDocument(COLLECTION_WALLETS, wallet.id, {
        amount: `${newAmount}`,
      });

      let completed = false;

      if (intLimitAmount === intAmount) {
        completed = true;
      }

      const dataUpdate = {
        transactions: [...currentWishlist.transactions, transactionId],
        amount: `${intWishlistAmount + intAmount}`,
        completed,
      };

      await updateDocument(
        COLLECTION_WISHLISTS,
        currentWishlist.id,
        dataUpdate
      );
      navigate.goBack();
    }
  };

  const handleSaveRegular = async () => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }

    setInvalidAmount(false);
    setLoading(true);

    let locationId = "";

    if (location) {
      const newLocationExists = locations.find(
        (loc) => loc.name.trim().toLowerCase() === location.trim().toLowerCase()
      );
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
    }

    const data: TransactionItemFirestore = {
      userId: user.id,
      sharedAccounId: user.sharedAccounId,
      amount,
      categoryId: category.id,
      transactionTypeId: transactionType.id,
      transactionDirection,
      description,
      locationId,
      date,
      time,
      createdAt: new Date(),
      origin: "default",
      archived: false,
    };

    const addTransaction = transactionDirection === 1;
    const intAmount = convertToFloat(amount);
    const intWallet = convertToFloat(wallet.amount);

    let newAmount = 0;

    if (addTransaction) {
      newAmount = intWallet + intAmount;
    } else {
      newAmount = intWallet - intAmount;
    }

    await addDocument<TransactionItemFirestore>(COLLECTION_TRANSACTIONS, data);

    await updateDocument(COLLECTION_WALLETS, wallet.id, {
      amount: `${newAmount}`,
    });

    navigate.goBack();
  };

  const handleCategoryChange = (item: DropdownItem) => {
    setCategory(item);
  };
  const handleTypeChange = (item: DropdownItem) => {
    setTransactionType(item);
  };

  const handleFocusLocation = () => {
    notesInput.current?.focus();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader
        onPress={handleSubmit}
        title={buttonTitle}
        isLoading={loading}
      />
      <View>
        {!wishlistId && (
          <SegmentedControl
            appearance="dark"
            values={transactionDirections}
            selectedIndex={transactionDirection}
            onChange={(event) => {
              setTransactionDirection(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        )}
        <AmountInput
          ref={amountInput}
          value={amount}
          onChange={setAmount}
          index={transactionDirection}
          isInvalid={invalidAmount}
        />
        <FormListContainer style={styles.textInputContainer}>
          {!wishlistId && (
            <>
              <FormListContent>
                <DropDownMenu
                  label="Category"
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  data={categories}
                />
              </FormListContent>
              <FormListSeparator />
            </>
          )}
          <FormListContent>
            <DropDownMenu
              label="Transaction type"
              id="type"
              value={transactionType}
              onChange={handleTypeChange}
              data={transactionTypes}
            />
          </FormListContent>
          {!wishlistId && (
            <>
              <FormListSeparator />
              <FormListContent>
                <Text style={styles.flex}>Date</Text>
                <View style={styles.datePickerContent}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={(_, date) => onChange(date, "date")}
                    themeVariant="dark"
                  />
                  <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    onChange={(_, date) => onChange(date, "time")}
                    themeVariant="dark"
                  />
                </View>
              </FormListContent>
            </>
          )}
        </FormListContainer>
        {!wishlistId && (
          <FormListContainer style={styles.textInputContainer}>
            <AutoComplete
              ref={locationInput}
              suggestions={locations}
              zIndex={3}
              InputProps={{
                placeholder: "Location",
                value: location,
                onChangeText: setLocation,
                onSubmitEditing: handleFocusLocation,
                type: "text",
                returnKeyType: "next",
              }}
            />
            <FormListSeparator />
            <InputForm
              ref={notesInput}
              InputProps={{
                placeholder: "Description",
                value: description,
                onChangeText: setDescription,
                onSubmitEditing: () => handleSubmit(),
                type: "text",
                returnKeyType: "send",
              }}
            />
          </FormListContainer>
        )}
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
  flex: { flex: 1, fontWeight: "800" },
  datePickerContent: { flexDirection: "row" },
});

export default AddTransactionScreen;
