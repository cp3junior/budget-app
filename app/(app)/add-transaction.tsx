import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
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
import { categories } from "../../lib/constant";

const directions = ["Expense", "Income"];

const types: DropdownItem[] = [
  {
    id: 1,
    label: "Credit",
    icon: "creditcard.and.123",
  },
  {
    id: 2,
    label: "Debit",
    icon: "creditcard.fill",
  },
];

const AddTransactionScreen = () => {
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState<DropdownItem>(
    categories[0]?.items?.[0] as DropdownItem
  );
  const [type, setType] = useState<DropdownItem>(types[0]);
  const [date, setDate] = useState(new Date());
  const [isLocationFocused, setIsLocationFocused] = useState(false);

  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) setDate(selectedDate);
  };

  const handlePress = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("saved");
    }, 2000);
  };

  const handleCategoryChange = (item: DropdownItem) => {
    setCategory(item);
  };
  const handleTypeChange = (item: DropdownItem) => {
    setType(item);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={isLocationFocused ? 150 : 0}
    >
      <ModalHeader onPress={handlePress} title="Add" isLoading={loading} />
      <View>
        <SegmentedControl
          appearance="dark"
          values={directions}
          selectedIndex={index}
          onChange={(event) => {
            setIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <AmountInput index={index} />
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
              label="Type"
              id="type"
              value={type}
              onChange={handleTypeChange}
              data={types}
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
                onChange={onChange}
                themeVariant="dark"
              />
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour={true}
                onChange={onChange}
                themeVariant="dark"
              />
            </View>
          </FormListContent>
        </FormListContainer>
        <FormListContainer style={styles.textInputContainer}>
          <AutoComplete
            zIndex={2}
            placeholder="Locations"
            onFocus={setIsLocationFocused}
          />
          <FormListSeparator />
          <InputForm InputProps={{ placeholder: "Notes" }} />
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
