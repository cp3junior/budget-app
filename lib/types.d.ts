import { Timestamp } from "firebase/firestore";
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

  type ProductPrice = {
    id: string;
    location: string;
    amount: string;
    date: Date | Timestamp;
    createdAt: Date | Timestamp;
  };

  type SuggestionAutocomplete = {
    id: string;
    name: string;
  };

  //** Normal types */
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
    amount: string;
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

  type DropdownItem = {
    id: number;
    label: string;
    items?: DropdownItem[];
    icon?: SystemName;
  };
}

export {};
