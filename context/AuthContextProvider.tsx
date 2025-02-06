import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@firebase/auth";
import { authStateListener } from "../lib/firebaseAuth";

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authStateListener((user: User | null) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
