import { Timestamp, WhereFilterOp } from "firebase/firestore";
import { pieDataItem } from "react-native-gifted-charts";
import { SystemName } from "sweet-sfsymbols/src/SweetSFSymbols.types";

declare global {
  interface TabIconProps {
    isFocused: boolean;
  }

  type User = UserFirestore & {
    id: string;
  };

  type UserFirestore = {
    uid: string;
    sharedAccounName: string;
    sharedAccounId: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    createdAt: Date | Timestamp;
  };

  type ShareRequest = ShareRequestFirestore & {
    id: string;
  };

  type ShareRequestFirestore = {
    senderName: string;
    sender: string;
    receiver: string;
    status: StatusRequest;
    updatedAt: Date | Timestamp;
    createdAt: Date | Timestamp;
  };

  type LocationItem = LocationItemFirestore & {
    id: string;
  };

  type LocationItemFirestore = {
    sharedAccounId: string;
    name: string;
    createdAt: Date | Timestamp;
  };

  type ProductItem = ProductItemFirestore & {
    id: string;
  };

  type ProductItemFirestore = {
    sharedAccounId: string;
    name: string;
    prices: ProductPrice[];
    createdAt: Date | Timestamp;
  };

  type TransactionItemWithUser = TransactionItem & {
    user: User;
    displayName: string;
  };

  type TransactionItem = TransactionItemFirestore & {
    id: string;
  };

  type TransactionItemFirestore = {
    sharedAccounId: string;
    userId: string;
    categoryId: number;
    transactionTypeId: number;
    budgetId: string;
    locationId?: string;
    transactionDirection: number;
    amount: string;
    description?: string;
    archived: boolean;
    origin: TransactionOrigins;
    date: Date | Timestamp;
    time: Date | Timestamp;
    createdAt: Date | Timestamp;
  };

  type WishListItem = WishListItemFirestore & {
    id: string;
  };

  type WishListItemFirestore = {
    sharedAccounId: string;
    transactions: string[];
    fullAmount: string;
    amount: string;
    name: string;
    description: string;
    categoryId: number;
    completed: boolean;
    createdAt: Date | Timestamp;
  };

  type WalletItem = WalletItemFirestore & {
    id: string;
  };
  type WalletItemFirestore = {
    sharedAccounId: string;
    amount: string;
    monthlyIncome: string;
    updatedAt: Date | Timestamp;
    createdAt: Date | Timestamp;
  };

  type ExpenseItem = ExpenseItemFirestore & {
    id: string;
  };

  type ExpenseItemFirestore = {
    name: string;
    sharedAccounId: string;
    categoryId: number;
    amount: string;
    completed: boolean;
    description: string;
    notificationEnabled: boolean;
    notificationTime: Date | Timestamp;
    notificationIds?: string[];
    isRecurring: boolean;
    repeatingDay: number;
    frequency: number;
    startDate: Date | Timestamp;
    endDate: Date | Timestamp;
    createdAt: Date | Timestamp;
  };

  type ProductPrice = {
    id: string;
    locationId: string;
    amount: string;
    date: Date | Timestamp;
    createdAt: Date | Timestamp;
  };

  type SuggestionAutocomplete = {
    id: string;
    name: string;
  };

  enum PeriodExpense {
    1 = "month",
    2 = "week",
    3 = "2weeks",
  }
  enum PeriodExpenseStr {
    "month" = 1,
    "week" = 2,
    "2weeks" = 3,
  }

  type TransactionOrigins = "wishlist" | "default" | "bills";

  type StatusRequest = "pending" | "accepted" | "rejected" | "cancelled";

  type ToggleItem = {
    label: string;
    value: string;
    activeBg?: string;
  };

  type ProfileForm = {
    firstName: string;
    lastName: string;
    email: string;
  };

  type ForgotPasswordForm = {
    email: string;
  };

  type ProductPriceForm = {
    location: string;
  };
  type SignInForm = {
    email: string;
    password: string;
  };

  type SignUpForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rePassword: string;
  };

  type WhishlistForm = {
    name: string;
    description: string;
  };

  type DropdownItem<T = unknown> = {
    id: number;
    label: string;
    items?: DropdownItem[];
    icon?: SystemName;
    value?: T;
  };

  type ExpenseItemFront = ExpenseItem & {
    total: number;
    category: DropdownItem | null;
    dates: Date[];
  };

  type GroupedExpenseItem = DropdownItem & {
    data: ExpenseItem[];
  };

  type GroupedExpenseItemFront = DropdownItem & {
    data: ExpenseItemFront[];
    total: number;
  };

  type FetchOption = {
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    whereClauses?: WhereClause[];
    ids?: string[];
    limit?: number;
  };

  type WhereClause = {
    field: string;
    operator: WhereFilterOp;
    value: any;
  };

  type GroupedTransactions = {
    id: string;
    formatedDate: string;
    formatedDateShort: string;
    data: TransactionItem[];
  };

  type PieItem = pieDataItem & {
    percentage: number;
    label: string;
    color: string;
  };
}

export {};
