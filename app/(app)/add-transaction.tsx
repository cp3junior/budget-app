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

const types = ["Credit", "Debit"];

const directions = ["Expense", "Income"];

const AddTransactionScreen = () => {
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [index2, setIndex2] = useState(0);

  const [date, setDate] = useState(new Date());

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

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
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
          <View style={styles.listItemContainer}>
            <Text fontWeight="800" style={styles.flex}>
              Category
            </Text>
            <View>
              <Text>Sell</Text>
            </View>
          </View>
          {/* <InputForm InputProps={{ placeholder: "Category select" }} /> */}

          <FormListSeparator />
          <View style={styles.listItemContainer}>
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
          </View>
        </FormListContainer>
        <FormListContainer style={styles.textInputContainer}>
          <Text>OKOKO</Text>
          {/* <InputForm InputProps={{ placeholder: "Location" }} /> */}
          <AutoComplete zIndex={1} label="Location" />
          <FormListSeparator />
          <InputForm InputProps={{ placeholder: "Notes" }} />
        </FormListContainer>

        {/* <AutoComplete zIndex={2} label="Category" /> */}
        {/* <AutoComplete zIndex={1} label="Location" /> */}

        <SegmentedControl
          appearance="dark"
          values={types}
          selectedIndex={index2}
          onChange={(event) => {
            setIndex2(event.nativeEvent.selectedSegmentIndex);
          }}
        />
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
  listItemContainer: {
    flexDirection: "row",
    height: 44,
    alignItems: "center",
    paddingRight: 20,
  },
  datePickerContent: { flexDirection: "row" },
});

export default AddTransactionScreen;
