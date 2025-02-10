import { FirebaseError } from "firebase/app";

export const getFileExtension = (filename: string): string | null => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() || null : null;
};

export const formatCurrency = (
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

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
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
