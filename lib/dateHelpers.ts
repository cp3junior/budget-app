import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isEqual,
  isSameMonth,
  isWithinInterval,
  lastDayOfMonth,
  parseISO,
  setDate,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { Timestamp, Transaction } from "firebase/firestore";

export const formatHour = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "HH:mm");
};
export const getHourMinute = (date: Date | Timestamp): [string, string] => {
  const convertedDate = convertToDate(date);
  return [format(convertedDate, "HH"), format(convertedDate, "mm")];
};

export const formatDateMonthDate = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "MMM. do");
};
export const formatDateMonthDateGraph = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "d MMM");
};
export const formatDateMonthDateFull = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "MMMM do");
};

export const formatDate = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "dd MMM yyyy");
};
export const formatDateTransaction = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "MMM d, yyyy");
};
export const formatDateTransactionTh = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "MMMM do, yyyy");
};
export const formatDateExpense = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "MMMM do, yyyy");
};

export const formatDateSimpleMonthDate = (date: Date | Timestamp): string => {
  const convertedDate = convertToDate(date);
  return format(convertedDate, "yyyy-MM-dd");
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

  for (let i = -4; i <= 8; i++) {
    const month = addMonths(date, i);
    months.push(getMonthDropdown(month));
  }

  return months;
};
export const generateSixMonthListDropdown = (date: Date): DropdownItem[] => {
  const months: DropdownItem[] = [];

  for (let i = -6; i <= 0; i++) {
    const month = addMonths(date, i);
    months.push(getMonthDropdown(month));
  }

  return months;
};

export const generateLastTenDays = (): string[] => {
  const currentDate = new Date();
  const lastTenDays: string[] = [];

  for (let i = 0; i < 10; i++) {
    const day = addDays(currentDate, -i);
    lastTenDays.push(formatDateSimple(day));
  }

  return lastTenDays;
};

export const getMonthDropdown = (date: Date): DropdownItem => {
  const dateBegin = startOfMonth(date);
  const month = format(dateBegin, "yyyy-MM-dd");
  const monthName = format(dateBegin, "MMMM yyyy");
  return {
    id: parseInt(month.replaceAll("-", "")),
    label: monthName,
    value: month,
  };
};

export const getCurrentMonthString = (date: Date): string => {
  const dateBegin = startOfMonth(date);
  return format(dateBegin, "yyyy-MM-dd");
};

export const countWeekdaysInMonth = (
  monthValue: string,
  weekday: number
): Date[] => {
  const start = parseISO(monthValue);
  const end = endOfMonth(start);

  const days = eachDayOfInterval({ start, end });

  return days.filter((day) => getDay(day) === weekday);
};

export const countBiweeklyDays = (
  monthValue: string,
  startDateRaw: Date | Timestamp,
  weekday: number
): Date[] => {
  const startDateStr = formatDateSimple(startDateRaw);
  let startDate = parseISO(startDateStr);

  const start = parseISO(monthValue);
  const end = endOfMonth(start);

  while (getDay(startDate) !== weekday) {
    startDate = addDays(startDate, 1);
  }

  const startDated = formatDateSimple(startDate);

  startDate = parseISO(startDated);

  let payments: Date[] = [];
  let currentPayment = startDate;

  while (currentPayment <= end) {
    if (isSameMonth(currentPayment, start)) {
      payments.push(currentPayment);
    }
    currentPayment = addWeeks(currentPayment, 2);
  }

  return payments;
};

export const isWithinDateInterval = (
  today: string,
  expense: ExpenseItem
): boolean => {
  let startDate = convertToDate(expense.startDate);
  let endDate = convertToDate(expense.endDate);

  startDate = startOfMonth(startDate);
  endDate = endOfMonth(endDate);

  const strStart = formatDateSimple(startDate);
  const strEnd = formatDateSimple(endDate);

  return isWithinInterval(today, {
    start: strStart,
    end: strEnd,
  });
};

export const getNextDate = (dates: Date[]): Date | undefined => {
  const today = addDays(new Date(), -1);

  const futureDates = dates.find(
    (date) => isEqual(date, today) || isAfter(date, today)
  );
  return futureDates;
};

export const getMonthDate = (
  currentMonth: string,
  repeatingDay: number
): Date => {
  return setDate(parseISO(currentMonth), repeatingDay);
};

export const isDateInCurrentMonth = (date: Date | Timestamp): boolean => {
  const dateStr = formatDateSimple(date);
  const givenDate = parseISO(dateStr);
  const today = new Date();
  return isSameMonth(givenDate, today);
};

export const getStartEndMonthDays = (currentDate: Date): [Date, Date] => {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  return [startOfDay(start), endOfDay(end)];
};

export const groupTransactionByDate = (
  transactions: TransactionItem[]
): GroupedTransactions[] => {
  const grouped = transactions.reduce<{ [key: string]: TransactionItem[] }>(
    (acc, transaction) => {
      const keyDate = formatDateSimple(transaction.date);

      if (!acc[keyDate]) {
        acc[keyDate] = [];
      }

      acc[keyDate].push(transaction);
      return acc;
    },
    {}
  );

  return Object.keys(grouped).map((date) => {
    const dateStr = parseISO(date);
    return {
      id: date,
      formatedDate: formatDateMonthDateFull(dateStr),
      formatedDateShort: formatDateSimple(dateStr),
      data: grouped[date],
    };
  });
};

export const getIntervalMonthDropdown = (
  data: DropdownItem[]
): [Date, Date] => {
  const start = parseISO(data[0].value as string);
  const end = parseISO(data[data.length - 1].value as string);
  const endDate = lastDayOfMonth(end);
  return [startOfDay(start), endOfDay(endDate)];
};

export const groupTransactionByMonth = (
  transactions: TransactionItem[],
  months: DropdownItem[]
): GroupedTransactions[] => {
  const groupedMonth: { [key: string]: TransactionItem[] } = {};

  for (const item of months) {
    const month = item.value as string;
    const monthTransactions = transactions.filter((transaction) => {
      const dateStr = formatDateSimple(transaction.date);
      const givenDate = parseISO(dateStr);
      const monthDate = parseISO(month);
      return isSameMonth(givenDate, monthDate);
    });
    groupedMonth[month] = monthTransactions;
  }

  return Object.keys(groupedMonth).map((date) => {
    const dateStr = parseISO(date);
    return {
      id: date,
      formatedDate: formatDateMonthDateFull(dateStr),
      formatedDateShort: formatDateSimple(dateStr),
      data: groupedMonth[date],
    };
  });
};
