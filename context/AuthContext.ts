import { User } from "@firebase/auth";
import { createContext } from "react";

interface AuthContextType {
  currentUser: User | null;
  showPopup: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
