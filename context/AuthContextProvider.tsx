import { User as UserFirebase } from "@firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { authStateListener } from "../lib/firebaseAuth";
import { AuthContext } from "./AuthContext";

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserFirebase | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = authStateListener(async (user: UserFirebase | null) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setAuthReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
