import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { Unsubscribe } from "firebase/firestore";
import { authStateListener } from "../lib/firebaseAuth";
import { User as UserFirebase } from "@firebase/auth";
import { fetchSnapshot, updateDocument } from "../lib/firebaseFirestore";
import {
  COLLECTION_LOCATIONS,
  COLLECTION_PRODUCTS,
  COLLECTION_REQUESTS,
  COLLECTION_USER,
  COLLECTION_WISHLISTS,
} from "../lib/constant";
import { Alert } from "react-native";

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [wishlists, setWishlists] = useState<WishListItem[]>([]);

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
    let locationUnsubscribe: null | Unsubscribe = null;
    if (user) {
      locationUnsubscribe = fetchSnapshot<LocationItem>(
        COLLECTION_LOCATIONS,
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
          setLocations(data);
        }
      );
    }

    return () => {
      if (locationUnsubscribe) locationUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    let productUnsubscribe: null | Unsubscribe = null;
    if (user) {
      productUnsubscribe = fetchSnapshot<ProductItem>(
        COLLECTION_PRODUCTS,
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
          setProducts(data);
        }
      );
    }

    return () => {
      if (productUnsubscribe) productUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    let wishlistUnsubscribe: null | Unsubscribe = null;
    if (user) {
      wishlistUnsubscribe = fetchSnapshot<WishListItem>(
        COLLECTION_WISHLISTS,
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
          setWishlists(data);
        }
      );
    }

    return () => {
      if (wishlistUnsubscribe) wishlistUnsubscribe();
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
        locations,
        products,
        wishlists,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
