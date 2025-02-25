import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl, {
  NativeSegmentedControlIOSChangeEvent,
} from "@react-native-segmented-control/segmented-control";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
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
  baseExpenses,
  categories,
  COLLECTION_LOCATIONS,
  COLLECTION_TRANSACTIONS,
  COLLECTION_WALLETS,
  COLLECTION_WISHLISTS,
  frequencyItem,
  transactionDirections,
  transactionTypes,
} from "../../lib/constant";
import {
  formatDateSimpleMonthDate,
  getCurrentMonthString,
  isWithinDateInterval,
} from "../../lib/dateHelpers";
import { addDocument, updateDocument } from "../../lib/firebaseFirestore";
import {
  calculateRemainingRaw,
  convertToFloat,
  formatCurrency,
  getCategoryByCategoryId,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";

const currentMonth = getCurrentMonthString(new Date());
const defaultMessage =
  "⚠️  Extra spending is unplanned and may impact your budget.";

const AddTransactionScreen = () => {
  const { user, locations, wallet, wishlists, expenses } = useAppContext();
  const navigate = useNavigation();
  const params = useLocalSearchParams();

  const wishlistId = (params.wishlistId as string) || "";
  const expenseId = (params.expenseId as string) || "";
  const currentWishlist = wishlists.find((wish) => wish.id === wishlistId);
  const currentExpense = expenses.find((exp) => exp.id === expenseId);

  let initialAmount = "";
  let initialExpense = baseExpenses;
  let initialCategory = categories[0]?.items?.[0] as DropdownItem;

  if (currentWishlist) {
    initialAmount = calculateRemainingRaw(
      currentWishlist.fullAmount,
      currentWishlist.amount
    );

    const category = getCategoryByCategoryId(currentWishlist.categoryId);
    if (category) initialCategory = category;
  }

  if (currentExpense) {
    initialAmount = currentExpense.amount;
    const category = getCategoryByCategoryId(currentExpense.categoryId);
    if (category) initialCategory = category;

    const start = formatDateSimpleMonthDate(currentExpense.startDate);
    const end = formatDateSimpleMonthDate(currentExpense.endDate);
    const id = parseInt(
      `${start}-${currentExpense.categoryId}-${end}`.replaceAll("-", "")
    );
    initialExpense = {
      label: currentExpense.name,
      id,
      value: currentExpense.id,
      icon: category?.icon || "questionmark",
    };
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
  const [showCategory, setShowCategory] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const [expense, setExpense] = useState<DropdownItem>(initialExpense);
  const [expensesList, setExpensesList] = useState<DropdownItem[]>([]);
  const [transactionType, setTransactionType] = useState<DropdownItem>(
    transactionTypes[0]
  );
  const [expenseMessage, setexpenseMessage] = useState("");

  useEffect(() => {
    let filteredExpenses = expenses.filter((e) => {
      const strToday = currentMonth;

      return isWithinDateInterval(strToday, e);
    });

    if (currentWishlist) {
      filteredExpenses = filteredExpenses.filter((e) => {
        return e.categoryId === currentWishlist.categoryId;
      });

      if (filteredExpenses.length === 0) {
        setexpenseMessage(
          `\n${defaultMessage}\nThere is no allocated monthly budget for this expense.`
        );
      }
    }

    const dropdownExpense: DropdownItem[] = filteredExpenses.map((ex) => {
      const start = formatDateSimpleMonthDate(ex.startDate);
      const end = formatDateSimpleMonthDate(ex.endDate);
      const id = parseInt(
        `${start}-${ex.categoryId}-${end}`.replaceAll("-", "")
      );
      const category = getCategoryByCategoryId(ex.categoryId);
      return {
        label: ex.name,
        id,
        value: ex.id,
        icon: category?.icon || "questionmark",
      };
    });

    setExpensesList([baseExpenses, ...dropdownExpense]);
  }, [expenses, currentWishlist]);

  if (!user) return null;
  if (!wallet) return null;

  const onChange = (selectedDate: Date | undefined, name: string) => {
    if (selectedDate) {
      if (name === "date") setDate(selectedDate);
      if (name === "time") setTime(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!amount) {
      setInvalidAmount(true);
      amountInput.current?.focus();
      return;
    }
    setInvalidAmount(false);

    if (wishlistId) {
      handleSaveWishlist();
      return;
    }

    handleSaveRegular();
  };

  const handleSaveWishlist = async () => {
    if (currentWishlist) {
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

      setLoading(true);

      const data: TransactionItemFirestore = {
        userId: user.id,
        sharedAccounId: user.sharedAccounId,
        amount,
        categoryId: category.id,
        transactionTypeId: transactionType.id,
        budgetId: expense.value as string,
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
      budgetId: expense.value as string,
      transactionDirection,
      description,
      locationId,
      date,
      time,
      createdAt: new Date(),
      origin: expenseId ? "bills" : "default",
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
  const handleExpenseChange = (item: DropdownItem) => {
    const value = item.value as string;
    if (value) {
      setShowCategory(false);
      const expense = getExpenseById(value);
      let message = "";
      if (expense) {
        const expenseCategory = getCategoryByCategoryId(expense.categoryId);
        if (expenseCategory) setCategory(expenseCategory);

        if (expense.isRecurring) {
          if (expense.frequency === frequencyItem.month) {
            message = `The limit for this expense is ${formatCurrency(
              expense.amount
            )} monthly.`;
          }
          if (expense.frequency === frequencyItem["2weeks"]) {
            message = `This expense of ${formatCurrency(
              expense.amount
            )} recurs every 2 weeks.`;
          }
          if (expense.frequency === frequencyItem.week) {
            message = `This expense of ${formatCurrency(
              expense.amount
            )} recurs every week.`;
          }
        } else {
          message = `The limit for this expense is ${formatCurrency(
            expense.amount
          )} monthly.`;
        }
        setexpenseMessage(message);
      }
    } else {
      setShowCategory(true);
      setexpenseMessage(defaultMessage);
    }
    setExpense(item);
  };
  const handleTypeChange = (item: DropdownItem) => {
    setTransactionType(item);
  };

  const getExpenseById = (id: string): ExpenseItem | undefined =>
    expenses.find((expense) => expense.id === id);

  const handleFocusLocation = () => {
    notesInput.current?.focus();
  };

  const handleExpenseIncomeChange = (
    event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>
  ) => {
    const index = event.nativeEvent.selectedSegmentIndex;
    if (index === 1) {
      setexpenseMessage(defaultMessage);
      setShowCategory(true);
      setExpense(baseExpenses);
      setShowExpense(false);
    } else {
      setShowExpense(true);
    }
    setTransactionDirection(index);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <ModalHeader
        onPress={handleSubmit}
        title={buttonTitle}
        isLoading={loading}
      />
      <View>
        {!wishlistId && !expenseId && (
          <SegmentedControl
            appearance="dark"
            values={transactionDirections}
            selectedIndex={transactionDirection}
            onChange={handleExpenseIncomeChange}
          />
        )}
        <AmountInput
          ref={amountInput}
          value={amount}
          onChange={setAmount}
          index={transactionDirection}
          isInvalid={invalidAmount}
        />
        {showExpense && !expenseId && (
          <View>
            <FormListContainer style={styles.expenseCOntainer}>
              <FormListContent>
                <DropDownMenu
                  label="Expense"
                  id="expense"
                  value={expense}
                  onChange={handleExpenseChange}
                  data={expensesList}
                />
              </FormListContent>
            </FormListContainer>
            <Text style={styles.expenseTextWarn}>{expenseMessage}</Text>
          </View>
        )}
        {!wishlistId && (
          <>
            <FormListContainer style={styles.textInputContainer}>
              {showCategory && !expenseId && (
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
            </FormListContainer>
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
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  expenseTextWarn: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.grayLight,
    marginLeft: 20,
  },
  expenseCOntainer: {
    padding: 0,
    marginTop: 20,
  },
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
