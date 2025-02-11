import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useNavigation } from "expo-router";
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
  transactionDirections,
  transactionTypes,
} from "../../lib/constant";
import { addDocument } from "../../lib/firebaseFirestore";

const AddTransactionScreen = () => {
  const { user, locations } = useAppContext();
  const navigate = useNavigation();
  const notesInput = useRef<TextInput>(null);
  const locationInput = useRef<TextInput>(null);
  const amountInput = useRef<TextInput>(null);

  const [loading, setLoading] = useState(false);
  const [transactionDirection, setTransactionDirection] = useState(0);
  const [amount, setAmount] = useState("");
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [invalidLocation, setInvalidLocation] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [category, setCategory] = useState<DropdownItem>(
    categories[0]?.items?.[0] as DropdownItem
  );
  const [transactionType, setTransactionType] = useState<DropdownItem>(
    transactionTypes[0]
  );

  if (!user) return null;

  const onChange = (selectedDate: Date | undefined, name: string) => {
    if (selectedDate) {
      if (name === "date") setDate(selectedDate);
      if (name === "time") setTime(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }

    if (!location) {
      setInvalidLocation(true);
      locationInput.current?.focus();
      return;
    }

    setInvalidLocation(false);
    setInvalidAmount(false);
    setLoading(true);

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
      archived: false,
    };

    await addDocument<TransactionItemFirestore>(COLLECTION_TRANSACTIONS, data);

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
      <ModalHeader onPress={handleSubmit} title="Add" isLoading={loading} />
      <View>
        <SegmentedControl
          appearance="dark"
          values={transactionDirections}
          selectedIndex={transactionDirection}
          onChange={(event) => {
            setTransactionDirection(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <AmountInput
          ref={amountInput}
          value={amount}
          onChange={setAmount}
          index={transactionDirection}
          isInvalid={invalidAmount}
        />
        <FormListContainer style={styles.textInputContainer}>
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
          <FormListContent>
            <DropDownMenu
              label="Transaction type"
              id="type"
              value={transactionType}
              onChange={handleTypeChange}
              data={transactionTypes}
            />
          </FormListContent>
          <FormListSeparator />
          <FormListContent>
            <Text fontWeight="800" style={styles.flex}>
              Date
            </Text>
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
        </FormListContainer>
        <FormListContainer style={styles.textInputContainer}>
          <AutoComplete
            ref={locationInput}
            suggestions={locations}
            zIndex={3}
            isInvalid={invalidLocation}
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
              placeholder: "Notes",
              value: description,
              onChangeText: setDescription,
              onSubmitEditing: () => handleSubmit(),
              type: "text",
              returnKeyType: "send",
            }}
          />
        </FormListContainer>
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
});

export default AddTransactionScreen;
