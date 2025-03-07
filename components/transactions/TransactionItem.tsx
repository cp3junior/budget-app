import React from "react";
import { StyleSheet, View } from "react-native";
import SFSymbol from "sweet-sfsymbols";
import { useAppContext } from "../../hook/useAppContext";
import { transactionTypes } from "../../lib/constant";
import { formatDateTransactionTh } from "../../lib/dateHelpers";
import {
  formatCurrency,
  getCategoryByCategoryId,
  getDropdownItemById,
} from "../../lib/helpers";
import { colors } from "../../lib/theme";
import Text from "../common/Text";

interface TransactionItemProps {
  transaction: TransactionItem;
  noPad?: boolean;
  showDate?: boolean;
}

const TransactionItem = ({
  transaction,
  noPad,
  showDate,
}: TransactionItemProps) => {
  const { expenses } = useAppContext();

  const category = getCategoryByCategoryId(transaction.categoryId);
  const type = getDropdownItemById(
    transactionTypes,
    transaction.transactionTypeId
  );

  let color = colors.green;
  let prefix = "";
  let budgetStr = "";
  if (transaction.transactionDirection === 0) {
    color = colors.red;
    prefix = "- ";
    if (transaction.budgetId) {
      const expense = expenses.find(
        (expense) => expense.id === transaction.budgetId
      );
      if (expense) budgetStr = expense.name;
    } else {
      budgetStr = "Unbudgeted expense";
    }
  }

  let transactionType = "";
  if (type) transactionType = type.label;

  const textSecondLine = `${
    budgetStr ? `${budgetStr} - ` : ""
  }by ${transactionType} card`;

  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <View style={[styles.containerLeftIcon]}>
          <SFSymbol
            weight="thin"
            size={18}
            name={category?.icon ? category.icon : "questionmark"}
            colors={[colors.grayLight]}
          />
        </View>
      </View>
      <View
        style={[styles.containerRight, noPad ? { paddingRight: 0 } : undefined]}
      >
        <View>
          <Text style={styles.txtLabel}>{category?.label || ""}</Text>
          <Text style={styles.txtDate}>{textSecondLine}</Text>
          {showDate && (
            <Text style={styles.txtDate}>
              {formatDateTransactionTh(transaction.date)}
            </Text>
          )}
        </View>
        <View style={styles.containerAmount}>
          <Text style={{ ...styles.txtAmount, ...{ color } }}>
            {prefix}
            {formatCurrency(transaction.amount)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerSeparator: {
    paddingLeft: 50,
  },
  container: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  containerLeft: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  containerLeftIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.grayLight,
  },
  containerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingRight: 10,
  },
  txtLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  txtDate: {
    color: colors.grayLight,
    fontSize: 13,
    fontWeight: "600",
  },
  containerAmount: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  txtAmount: {
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 6,
  },
});

export default TransactionItem;
