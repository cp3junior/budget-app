import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User as UserFirebase } from "@firebase/auth";
import { authStateListener } from "../lib/firebaseAuth";
import { fetchDocuments } from "../lib/firebaseFirestore";
import { COLLECTION_USER } from "../lib/constant";

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = authStateListener(async (user: UserFirebase | null) => {
      if (user) {
        const users = await fetchDocuments<User>(COLLECTION_USER, {
          whereClauses: [{ field: "email", value: user.email, operator: "==" }],
        });
        if (users.length > 0) {
          setAuthReady(true);
          setCurrentUser(users[0]);
        }
      } else {
        setAuthReady(true);
        setCurrentUser(user);
      }
    });

    return () => unsubscribe();
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
