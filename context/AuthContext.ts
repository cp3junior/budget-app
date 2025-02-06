import { createContext } from "react";

interface AuthContextType {
  currentUser: User | null;
  authReady: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
