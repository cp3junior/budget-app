import { createContext } from "react";
import { User as UserFirebase } from "@firebase/auth";

interface AuthContextType {
  currentUser: UserFirebase | null;
  authReady: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
