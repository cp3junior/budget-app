import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AmountInput from "../../components/AmountInput";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import FormListContent from "../../components/common/FormList/FormListContent";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import FormListSwitch from "../../components/common/FormList/FormListSwitch";
import InputForm from "../../components/common/InputForm";
import ModalHeader from "../../components/common/ModalHeader";
import Text from "../../components/common/Text";
import {
  categories,
  COLLECTION_EXPENSES,
  dayOfMonth,
  dayOfWeek,
  frequencyList,
} from "../../lib/constant";
import { colors } from "../../lib/theme";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useAppContext } from "../../hook/useAppContext";
import { addDocument, updateDocument } from "../../lib/firebaseFirestore";
import {
  getCategoryByCategoryId,
  getDropdownItemById,
} from "../../lib/helpers";
import { convertToDate } from "../../lib/dateHelpers";

let initialCategory = categories[0]?.items?.[0] as DropdownItem;
let initialFrequency = frequencyList[0] as DropdownItem;
let initialRepeat = dayOfMonth[0] as DropdownItem;
let initialDataRepeatingDay = dayOfMonth;
let initialEndDate = new Date();
let initialStartDate = new Date();
let initialTime = new Date();
let initialRecurring = true;

const BillsEdit = () => {
  const navigate = useNavigation();
  const { user, wallet, expenses } = useAppContext();
  const params = useLocalSearchParams();
  const amountInput = useRef<TextInput>(null);

  const expenseId = (params.expenseId as string) || "";
  const currentExpense = expenses.find((wish) => wish.id === expenseId);

  if (currentExpense) {
    initialRecurring = currentExpense.isRecurring;
    initialEndDate = convertToDate(currentExpense.endDate);
    initialStartDate = convertToDate(currentExpense.startDate);
    initialTime = convertToDate(currentExpense.notificationTime);
    const category = getCategoryByCategoryId(currentExpense.categoryId);
    if (category) initialCategory = category;

    const freq = getDropdownItemById(frequencyList, currentExpense.frequency);
    if (freq) initialFrequency = freq;

    if (currentExpense.frequency === 1) {
      const repeat = getDropdownItemById(
        dayOfMonth,
        currentExpense.repeatingDay
      );
      if (repeat) initialRepeat = repeat;
      initialDataRepeatingDay = dayOfMonth;
    } else {
      const repeat = getDropdownItemById(
        dayOfWeek,
        currentExpense.repeatingDay
      );
      if (repeat) initialRepeat = repeat;
      initialDataRepeatingDay = dayOfWeek;
    }
  }

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(currentExpense?.amount || "");
  const [name, setName] = useState(currentExpense?.name || "");
  const [category, setCategory] = useState<DropdownItem>(initialCategory);
  const [frequency, setFrequency] = useState<DropdownItem>(initialFrequency);
  const [repeatingDay, setRepeatingDay] = useState<DropdownItem>(initialRepeat);
  const [dataRepeatingDay, setDataRepeatingDay] = useState<DropdownItem[]>(
    initialDataRepeatingDay
  );
  const [endDate, setEndDate] = useState<Date>(initialEndDate);
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [notificationTime, setNotificationTime] = useState<Date>(initialTime);
  const [description, setDescription] = useState(
    currentExpense?.description || ""
  );
  const [isRecurring, setIsRecurring] = useState(initialRecurring);
  const [notificationEnabled, setNotificationEnabled] = useState(
    currentExpense?.notificationEnabled || false
  );
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [invalidName, setInvalidName] = useState(false);

  if (!user) return null;
  if (!wallet) return null;

  const toggleRecurring = () =>
    setIsRecurring((previousState) => !previousState);

  const toggleNotification = () =>
    setNotificationEnabled((previousState) => !previousState);

  const handleDropdownChange = (item: DropdownItem, name: string) => {
    if (name === "category") setCategory(item);
    if (name === "frequency") {
      if (item.id !== frequency.id) {
        if (frequency.id === 1) {
          setDataRepeatingDay(dayOfWeek);
          setRepeatingDay(dayOfWeek[0]);
        }
        if (item.id === 1) {
          setDataRepeatingDay(dayOfMonth);
          setRepeatingDay(dayOfMonth[0]);
        }
      }
      setFrequency(item);
    }
    if (name === "repeat") setRepeatingDay(item);
  };

  const onChange = (selectedDate: Date | undefined, name: string) => {
    if (selectedDate) {
      if (name === "startDate") {
        setStartDate(selectedDate);
        setEndDate(selectedDate);
      }
      if (name === "endDate") setEndDate(selectedDate);
      if (name === "time") setNotificationTime(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }
    if (!name) {
      setInvalidName(true);
      return;
    }
    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }
    setInvalidAmount(false);
    setInvalidName(false);

    if (expenseId) editBill();
    else addBill();
  };

  const editBill = async () => {
    if (!currentExpense) return;
    setIsLoading(true);

    const dataUpdate = {
      name,
      categoryId: category.id,
      amount,
      description,
      notificationEnabled,
      notificationTime,
      isRecurring,
      repeatingDay: repeatingDay.id,
      frequency: frequency.id,
      endDate,
      startDate,
    };

    await updateDocument(COLLECTION_EXPENSES, currentExpense.id, dataUpdate);

    navigate.goBack();
  };

  const addBill = async () => {
    setIsLoading(true);

    const data: ExpenseItemFirestore = {
      name,
      sharedAccounId: user.sharedAccounId,
      categoryId: category.id,
      amount,
      completed: false,
      description,
      notificationEnabled,
      notificationTime,
      isRecurring,
      repeatingDay: repeatingDay.id,
      frequency: frequency.id,
      startDate,
      endDate,
      createdAt: new Date(),
    };

    await addDocument<ExpenseItemFirestore>(COLLECTION_EXPENSES, data);

    navigate.goBack();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ModalHeader
        onPress={handleSubmit}
        title={expenseId ? "Save" : "Add"}
        isLoading={isLoading}
      />
      <AmountInput
        ref={amountInput}
        value={amount}
        onChange={setAmount}
        index={0}
        isInvalid={invalidAmount}
      />
      <FormListContainer style={styles.textInputContainer}>
        <InputForm
          isInvalid={invalidName}
          InputProps={{
            placeholder: "Name",
            value: name,
            onChangeText: setName,
            type: "text",
            blurOnSubmit: true,
            returnKeyType: "next",
          }}
        />
        <FormListSeparator />
        <FormListContent>
          <DropDownMenu
            label="Category"
            id="category"
            value={category}
            onChange={(item) => handleDropdownChange(item, "category")}
            data={categories}
          />
        </FormListContent>
        <FormListSeparator />
        <InputForm
          InputProps={{
            placeholder: "Description",
            value: description,
            onChangeText: setDescription,
            type: "text",
            blurOnSubmit: true,
            returnKeyType: "next",
          }}
        />
        <FormListSeparator />
        <FormListContent>
          <Text style={styles.textDate}>Start date</Text>
          <View style={styles.datePickerContent}>
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(_, date) => onChange(date, "startDate")}
              themeVariant="dark"
            />
          </View>
        </FormListContent>
        <FormListSeparator />
        <FormListContent>
          <Text style={styles.textDate}>End date</Text>
          <View style={styles.datePickerContent}>
            <DateTimePicker
              value={endDate}
              mode="date"
              onChange={(_, date) => onChange(date, "endDate")}
              themeVariant="dark"
            />
          </View>
        </FormListContent>
        <FormListSeparator />

        <FormListSwitch
          label="Recurring Payment"
          onValueChange={toggleRecurring}
          value={isRecurring}
        />
      </FormListContainer>
      <Text style={styles.textExplanation}>
        Turn this on for expenses with a fixed due date, like rent or bills, so
        you can set reminders. Turn it off for monthly flexible expenses like
        groceries.
      </Text>
      {isRecurring && (
        <>
          <FormListContainer style={styles.textInputContainer}>
            <FormListContent>
              <DropDownMenu
                label="Frequency"
                id="frequency"
                value={frequency}
                onChange={(item) => handleDropdownChange(item, "frequency")}
                data={frequencyList}
              />
            </FormListContent>
            <FormListSeparator />
            <FormListContent>
              <DropDownMenu
                label="Repeat every"
                id="reppeat"
                value={repeatingDay}
                onChange={(item) => handleDropdownChange(item, "repeat")}
                data={dataRepeatingDay}
              />
            </FormListContent>
          </FormListContainer>
          <FormListContainer style={styles.textInputContainer}>
            <FormListSwitch
              label="Enable notification"
              onValueChange={toggleNotification}
              value={notificationEnabled}
            />
            {notificationEnabled && (
              <>
                <FormListSeparator />
                <FormListContent>
                  <Text style={styles.textDate}>Time</Text>
                  <View style={styles.datePickerContent}>
                    <DateTimePicker
                      value={notificationTime}
                      mode="time"
                      onChange={(_, date) => onChange(date, "time")}
                      themeVariant="dark"
                    />
                  </View>
                </FormListContent>
              </>
            )}
          </FormListContainer>
          <Text style={styles.textExplanation}>
            Turn on notifications to receive a reminder for this budget item
          </Text>
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textExplanation: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.grayLight,
    marginTop: -15,
    marginLeft: 20,
  },
  textInputContainer: {
    padding: 0,
    marginBottom: 20,
  },
  datePickerContent: { flexDirection: "row" },
  textDate: { flex: 1, fontWeight: "800" },
});

export default BillsEdit;
