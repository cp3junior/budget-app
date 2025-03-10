import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { colors } from "../../lib/theme";
import Text from "../../components/common/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalHeader from "../../components/common/ModalHeader";
import { useNavigation } from "expo-router";
import FormListContainer from "../../components/common/FormList/FormListContainer";
import DropDownMenu from "../../components/common/DropDownMenu/DropDownMenu";
import {
  categories,
  transactionDirectionsDropdown,
  transactionTypes,
} from "../../lib/constant";
import FormListSeparator from "../../components/common/FormList/FormListSeparator";
import FormListContent from "../../components/common/FormList/FormListContent";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFilterContext } from "../../hook/useFilterContext";
import {
  getCategoryByCategoryId,
  getDropdownItemById,
} from "../../lib/helpers";
import { addDays } from "date-fns";

const allCategories: DropdownItem = {
  id: 0,
  icon: "timelapse",
  label: "All",
};
const allTransactions: DropdownItem = {
  id: 0,
  icon: "timelapse",
  label: "All",
};
const categoryList = [allCategories, ...categories];
const transactionTypesList = [allTransactions, ...transactionTypes];

const TransactionFilter = () => {
  const navigate = useNavigation();
  const {
    setEndDate,
    setStartDate,
    startDate,
    endDate,
    categoryId,
    setCategoryId,
    transactionTypeId,
    setTransactionTypeId,
    transactionDirectionId,
    setTransactionDirectionId,
  } = useFilterContext();

  let initialCategory: DropdownItem = allCategories;
  if (categoryId !== 0) {
    initialCategory = getCategoryByCategoryId(categoryId) as DropdownItem;
  }

  const initialTransactionType: DropdownItem = getDropdownItemById(
    transactionTypesList,
    transactionTypeId
  ) as DropdownItem;

  const initialTransactionDirection: DropdownItem = getDropdownItemById(
    transactionDirectionsDropdown,
    transactionDirectionId
  ) as DropdownItem;

  const [category, setCategory] = useState<DropdownItem>(initialCategory);
  const [transactionType, setTransactionType] = useState<DropdownItem>(
    initialTransactionType
  );
  const [transactionDirection, setTransactionDirection] =
    useState<DropdownItem>(initialTransactionDirection);

  const handleSubmit = () => {
    navigate.goBack();
  };

  const handleCategoryChange = (item: DropdownItem) => {
    setCategory(item);
    setCategoryId(item.id);
  };
  const handleTypeChange = (item: DropdownItem) => {
    setTransactionType(item);
    setTransactionTypeId(item.id);
  };
  const handleDirectionChange = (item: DropdownItem) => {
    setTransactionDirection(item);
    setTransactionDirectionId(item.id);
  };
  const onReset = () => {
    const today = new Date();
    const lastTenDays = addDays(today, -30);
    setStartDate(lastTenDays);
    setEndDate(today);
    setCategoryId(0);
    setCategory(initialCategory);
    setTransactionTypeId(0);
    setTransactionType(initialTransactionType);
    setTransactionDirectionId(2);
    setTransactionDirection(initialTransactionDirection);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <ModalHeader onPress={handleSubmit} title="Filter" isLoading={false} />
      <View>
        <FormListContainer style={styles.textInputContainer}>
          <FormListContent>
            <Text style={styles.flex}>Start date</Text>
            <View style={styles.datePickerContent}>
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={(_, date) => setStartDate(date as Date)}
                themeVariant="dark"
              />
            </View>
          </FormListContent>
          <FormListSeparator />
          <FormListContent>
            <Text style={styles.flex}>End date</Text>
            <View style={styles.datePickerContent}>
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={(_, date) => setEndDate(date as Date)}
                themeVariant="dark"
              />
            </View>
          </FormListContent>
          <FormListSeparator />
          <FormListContent>
            <DropDownMenu
              label="Category"
              id="category"
              value={category}
              onChange={handleCategoryChange}
              data={categoryList}
            />
          </FormListContent>
          <FormListSeparator />
          <FormListContent>
            <DropDownMenu
              label="Transaction type"
              id="type"
              value={transactionType}
              onChange={handleTypeChange}
              data={transactionTypesList}
            />
          </FormListContent>
          <FormListSeparator />
          <FormListContent>
            <DropDownMenu
              label="Transaction direction"
              id="type"
              value={transactionDirection}
              onChange={handleDirectionChange}
              data={transactionDirectionsDropdown}
            />
          </FormListContent>
        </FormListContainer>
        <TouchableOpacity onPress={onReset}>
          <Text style={styles.textRest}>Reset filters</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 20,
  },
  flex: { flex: 1, fontWeight: "800" },
  datePickerContent: { flexDirection: "row" },
  textDate: { flex: 1, fontWeight: "800" },
  textRest: {
    textAlign: "center",
    fontWeight: "900",
    color: colors.red,
  },
});

export default TransactionFilter;
