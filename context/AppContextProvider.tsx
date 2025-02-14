import { User as UserFirebase } from "@firebase/auth";
import { Unsubscribe } from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  COLLECTION_EXPENSES,
  COLLECTION_LOCATIONS,
  COLLECTION_PRODUCTS,
  COLLECTION_REQUESTS,
  COLLECTION_USER,
  COLLECTION_WALLETS,
  COLLECTION_WISHLISTS,
} from "../lib/constant";
import { authStateListener } from "../lib/firebaseAuth";
import { fetchSnapshot, updateDocument } from "../lib/firebaseFirestore";
import { AppContext } from "./AppContext";

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [wishlists, setWishlists] = useState<WishListItem[]>([]);
  const [wallets, setWallets] = useState<WalletItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [wallet, setWallet] = useState<WalletItem | null>(null);

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

  useEffect(() => {
    if (!user) return;

    const subscriptions: Unsubscribe[] = [];

    const fetchData = <T,>(
      collectionName: string,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      transform?: (data: T[]) => T[]
    ) => {
      const unsubscribe = fetchSnapshot<T>(
        collectionName,
        {
          whereClauses: [
            {
              field: "sharedAccounId",
              value: user.sharedAccounId,
              operator: "==",
            },
          ],
        },
        (data) => {
          setter(transform ? transform(data) : data);
        }
      );

      subscriptions.push(unsubscribe);
    };

    fetchData<LocationItem>(COLLECTION_LOCATIONS, setLocations);
    fetchData<ProductItem>(COLLECTION_PRODUCTS, setProducts);
    fetchData<WishListItem>(COLLECTION_WISHLISTS, setWishlists, (data) =>
      data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    );
    fetchData<WalletItem>(COLLECTION_WALLETS, setWallets);
    fetchData<ExpenseItem>(COLLECTION_EXPENSES, setExpenses);

    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [user]);

  useEffect(() => {
    if (wallets.length === 1) setWallet(wallets[0]);
    else setWallet(null);
  }, [wallets]);

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
        locations,
        products,
        wishlists,
        wallet,
        expenses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
