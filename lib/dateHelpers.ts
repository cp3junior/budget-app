import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const formatDate = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "dd MMM yyyy");
};

export const formatDateSimple = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "yyyy-MM-dd");
};

export const convertToDate = (date: Date | Timestamp): Date => {
  if (date instanceof Date) return date;
  else if (date instanceof Timestamp) return date.toDate();
  return new Date();
};
