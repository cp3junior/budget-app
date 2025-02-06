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
    sharedAccounId: string;
    isSharing: boolean;
    sharingEmails: string[];
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    createdAt: Date | Timestamp;
  };

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
