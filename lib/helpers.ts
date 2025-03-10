import { FirebaseError } from "firebase/app";
import { categories, frequencyItem } from "./constant";
import {
  countBiweeklyDays,
  countWeekdaysInMonth,
  getMonthDate,
} from "./dateHelpers";

export const getFileExtension = (filename: string): string | null => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() || null : null;
};

export const formatCurrencyOld = (
  text: string
): [formatedValue: string, parsedValue: number] => {
  const cleanValue = text.replace(/[^0-9]/g, "");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const parsedValue = parseFloat(cleanValue) / 100;
  const formatedValue = formatter.format(parsedValue);
  return [formatedValue, parsedValue];
};

export const formatCurrency = (value: number | string): string => {
  let numberValue = 0;
  if (typeof value === "number") numberValue = value;
  else if (typeof value === "string") numberValue = convertToFloat(value);

  const formatedValue = numberFormater.format(numberValue);

  if (formatedValue.includes("-")) {
    const newFormatedValue = formatedValue.replace("-", "");
    return `- $${newFormatedValue}`;
  }
  return `$${formatedValue}`;
};

export const capitalize = (text: string): string => {
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};
export const capitalizeAndRemoveDash = (text: string): string => {
  const capitalized = capitalize(text);
  return capitalized.replace(/-/g, " ");
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const generateUniqueString = (length = 20) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const getErrorMessage = (error: unknown): string => {
  let message = "An error occured! Please try again later.";

  if (error instanceof FirebaseError) {
    const errorCode = error.code;
    switch (errorCode) {
      case "auth/invalid-credential":
        message = "Invalid credential. Please try again.";
        break;
      case "auth/invalid-email":
        message = "Invalid email. Please verify and try again.";
        break;
      case "auth/wrong-password":
        message = "Wrong password. Please verify and try again.";
        break;
      case "auth/email-already-in-use":
        message =
          "Email already exist. Please sign-in or recover your password.";
        break;
      case "auth/user-not-found":
      case "auth/user-disabled":
        message = "This user does not exist. Please verify and try again.";
        break;

      default:
        break;
    }
  }

  console.error(error);
  return message;
};

export const generateRandomString = (length = 10): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

export const convertToFloat = (value: string): number => {
  const parsed = parseFloat(value);

  if (!isNaN(parsed)) return parsed;

  return 0;
};

export const numberFormater = new Intl.NumberFormat("en-US");

export const calculateRemaining = (
  fullAmount: string,
  amount: string
): string => {
  const parsedFullAmount = convertToFloat(fullAmount);
  const parsedAmount = convertToFloat(amount);

  const remaining = parsedFullAmount - parsedAmount;
  return formatCurrency(remaining);
};
export const calculateRemainingRaw = (
  fullAmount: string,
  amount: string
): string => {
  const parsedFullAmount = convertToFloat(fullAmount);
  const parsedAmount = convertToFloat(amount);

  const remaining = parsedFullAmount - parsedAmount;
  return `${remaining}`;
};

export const calculateRemainingPercent = (
  fullAmount: string,
  amount: string
): number => {
  const parsedFullAmount = convertToFloat(fullAmount);
  const parsedAmount = convertToFloat(amount);

  if (parsedFullAmount <= 0) return 0;

  const remainingPercent = (parsedAmount / parsedFullAmount) * 100;
  return convertToFloat(remainingPercent.toFixed(2));
};

export const getCategoryByCategoryId = (
  categoryId: number
): DropdownItem | null => {
  for (const category of categories) {
    if (category.items) {
      const foundItem = category.items.find((item) => item.id === categoryId);
      if (foundItem) return foundItem;
    }
  }

  return null;
};

export const getMainCategoryByCategoryId = (
  categoryId: number
): DropdownItem | null => {
  for (const category of categories) {
    if (category.items) {
      const foundItem = category.items.find((item) => item.id === categoryId);
      if (foundItem) return category;
    }
  }

  return null;
};

export const getDropdownItemById = (
  items: DropdownItem[],
  id: number
): DropdownItem | null => {
  const item = items.find((t) => t.id === id);
  if (item) return item;

  return null;
};

export const getExpenseTotal = (
  expense: ExpenseItem,
  currentMonth: string
): [number, Date[]] => {
  const amount = convertToFloat(expense.amount);

  if (expense.isRecurring) {
    if (expense.frequency === frequencyItem.month) {
      const date = getMonthDate(currentMonth, expense.repeatingDay);

      return [amount, [date]];
    }
    if (expense.frequency === frequencyItem["2weeks"]) {
      const dates = countBiweeklyDays(
        currentMonth,
        expense.startDate,
        expense.repeatingDay
      );
      return [dates.length * amount, dates];
    }
    if (expense.frequency === frequencyItem.week) {
      const dates = countWeekdaysInMonth(currentMonth, expense.repeatingDay);
      return [dates.length * amount, dates];
    }
  }

  return [amount, []];
};

export const getExpenseGroupTotal = (
  expense: ExpenseItem[],
  currentMonth: string
): [number, ExpenseItemFront[]] => {
  let total = 0;
  const expenseFront: ExpenseItemFront[] = [];

  for (const ex of expense) {
    const [amount, dates] = getExpenseTotal(ex, currentMonth);
    const category = getCategoryByCategoryId(ex.categoryId);
    expenseFront.push({ ...ex, total: amount, dates, category });
    total += amount;
  }

  return [total, expenseFront];
};

export const getPercentage = (grandTotal: number, subTotal: number): number => {
  if (grandTotal === 0) return 0;
  return Math.ceil((subTotal / grandTotal) * 100);
};

export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && value.trim() !== "";
};

export const generateColors = (count: number): string[] => {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    const color = `hsl(${hue}, 70%, 50%)`;
    colors.push(color);
  }

  return colors;
};

export const getGroupedTransactionsByCategory = (
  transactions: TransactionItem[]
): PieItem[] => {
  const pieItems: PieItem[] = [];

  const grandTotal = transactions.reduce(
    (acc, item) => acc + convertToFloat(item.amount),
    0
  );

  const grouped = transactions.reduce((acc, item) => {
    if (!acc[item.categoryId]) {
      acc[item.categoryId] = [];
    }
    acc[item.categoryId].push(item);
    return acc;
  }, {} as Record<number, typeof transactions>);

  const groupedKeys = Object.keys(grouped);
  const colors = generateColors(groupedKeys.length);

  groupedKeys.forEach((key: string, index) => {
    const id = convertToFloat(key);
    const items = grouped[id];
    const subTotal = items.reduce(
      (acc, item) => acc + convertToFloat(item.amount),
      0
    );
    const category = getCategoryByCategoryId(id);

    const pieDataItem: PieItem = {
      value: subTotal,
      color: colors[index],
      percentage: getPercentage(grandTotal, subTotal),
      gradientCenterColor: "#fff",
      label: category?.label ?? "Unknown",
      focused: index === 0,
    };
    pieItems.push(pieDataItem);
  });

  return pieItems;
};
