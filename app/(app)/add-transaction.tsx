import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import ButtonLink from "../../components/common/ButtonLink";
import AutoComplete from "../../components/common/AutoComplete";
import { Spinner } from "@gluestack-ui/themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputForm from "../../components/common/InputForm";
import { colors } from "../../lib/theme";
import AmountInput from "../../components/AmountInput";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import Text from "../../components/common/Text";
import FormListContent from "../../components/common/FormList/FormListContent";
import DropDownMenu, {
  DropdownItem,
} from "../../components/common/DropDownMenu/DropDownMenu";
import { NumericFormat } from "react-number-format";
// import NumberFormat from "react-number-format";

const directions = ["Expense", "Income"];

const categories: DropdownItem[] = [
  {
    id: 1,
    label: "Groceries",
    items: [
      {
        id: 11,
        label: "Eggs",
        icon: "01.circle",
      },
      {
        id: 21,
        label: "Food",
        icon: "z.square",
      },
    ],
  },
  {
    id: 2,
    label: "Car",
    items: [
      {
        id: 12,
        label: "Gas",
        icon: "chevron.up.chevron.down",
      },
      {
        id: 22,
        label: "Maintenance",
        icon: "square.and.arrow.up",
      },
    ],
  },
  {
    id: 3,
    label: "Utilities",
    items: [
      {
        id: 13,
        label: "Electricity",
        icon: "chevron.up.chevron.down",
      },
      {
        id: 23,
        label: "Water",
        icon: "square.and.arrow.up",
      },
    ],
  },
];

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

  const handle = () => {
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
      <View style={styles.headerContainer}>
        <ButtonLink style={styles.btnStyle} href="../" title="Cancel" />
        {loading ? (
          <Spinner color={colors.blue} />
        ) : (
          <ButtonLink
            style={styles.btnStyle}
            href=""
            onPress={handle}
            title="Add"
          />
        )}
      </View>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  btnStyle: { fontSize: 18 },
  flex: { flex: 1 },
  datePickerContent: { flexDirection: "row" },
});

export default AddTransactionScreen;
