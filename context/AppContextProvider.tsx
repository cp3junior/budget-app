import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { Unsubscribe } from "firebase/firestore";
import { authStateListener } from "../lib/firebaseAuth";
import { User as UserFirebase } from "@firebase/auth";
import { fetchSnapshot, updateDocument } from "../lib/firebaseFirestore";
import { COLLECTION_REQUESTS, COLLECTION_USER } from "../lib/constant";
import { Alert } from "react-native";

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let userUnsubscribe: null | Unsubscribe = null;

    const unsubscribe = authStateListener(async (user: UserFirebase | null) => {
      if (user) {
        userUnsubscribe = fetchSnapshot<User>(
          COLLECTION_USER,
          {
            whereClauses: [
              { field: "email", value: user.email, operator: "==" },
            ],
          },
          (data) => {
            if (data.length > 0) {
              const currentUser = data[0];
              setUser(currentUser);
            }
          }
        );
      }
    });

    return () => {
      unsubscribe();
      if (userUnsubscribe) userUnsubscribe();
    };
  }, []);

  useEffect(() => {
    let requestUnsubscribe: null | Unsubscribe = null;
    if (user) {
      requestUnsubscribe = fetchSnapshot<ShareRequest>(
        COLLECTION_REQUESTS,
        {
          whereClauses: [
            { field: "receiver", value: user.email, operator: "==" },
            { field: "status", value: "pending", operator: "==" },
          ],
        },
        (data) => {
          if (data.length > 0) {
            const request = data[0];
            showAlert(request, user.id);
          }
        }
      );
    }

    return () => {
      if (requestUnsubscribe) requestUnsubscribe();
    };
  }, [user]);

  const showAlert = (request: ShareRequest, userId: string) => {
    const userName = request.senderName;
    const email = request.sender;
    Alert.alert(
      "Account Sharing Request",
      `${userName} (${email}) wants to share their account with you.\n\n⚠️ If you accept, you will lose your current data while sharing their account.`,

      [
        {
          text: "Decline",
          onPress: () => handleReject(request),
          style: "destructive",
        },
        {
          text: "Accept",
          onPress: () => handleAccept(request, userId),
          style: "default",
          isPreferred: true,
        },
      ],
      { cancelable: false }
    );
  };

  const handleAccept = async (request: ShareRequest, userId: string) => {
    const status: StatusRequest = "accepted";
    const senderMail = request.sender;
    const senderName = request.senderName;

    const userUpdated = {
      sharedAccounName: senderName,
      sharedAccounId: senderMail,
    };

    await updateDocument(COLLECTION_REQUESTS, request.id, {
      status,
    });
    setTimeout(async () => {
      await updateDocument(COLLECTION_USER, userId, userUpdated);
    }, 500);
  };

  const handleReject = async (request: ShareRequest) => {
    const status: StatusRequest = "rejected";
    await updateDocument(COLLECTION_REQUESTS, request.id, {
      status,
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
