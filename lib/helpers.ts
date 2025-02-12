import { FirebaseError } from "firebase/app";
import { categories, transactionTypes } from "./constant";

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

export const getTransactionTypeById = (id: number): DropdownItem | null => {
  const transactionType = transactionTypes.find((t) => t.id === id);
  if (transactionType) return transactionType;

  return null;
};
