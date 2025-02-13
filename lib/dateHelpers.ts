import { addMonths, format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const formatDate = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "dd MMM yyyy");
};
export const formatDateTransaction = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "MMM d, yyyy");
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

export const generateMonthListDropdown = (date: Date): DropdownItem[] => {
  const months: DropdownItem[] = [];

  for (let i = -4; i <= 4; i++) {
    const month = addMonths(date, i);
    months.push(getMonthDropdown(month));
  }

  return months;
};

export const getMonthDropdown = (date: Date): DropdownItem => {
  const month = format(date, "yyyy-MM-dd");
  const monthName = format(date, "MMMM yyyy");
  return {
    id: parseInt(month.replaceAll("-", "")),
    label: monthName,
    value: month,
  };
};
