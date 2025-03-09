import { User as UserFirebase } from "@firebase/auth";
import {
  addDays,
  addMinutes,
  addMonths,
  endOfDay,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import * as Notifications from "expo-notifications";
import { Unsubscribe } from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  COLLECTION_EXPENSES,
  COLLECTION_LOCATIONS,
  COLLECTION_PRODUCTS,
  COLLECTION_REQUESTS,
  COLLECTION_TRANSACTIONS,
  COLLECTION_USER,
  COLLECTION_WALLETS,
  COLLECTION_WISHLISTS,
} from "../lib/constant";
import {
  convertToDate,
  getCurrentMonthString,
  getHourMinute,
  getStartEndMonthDays,
} from "../lib/dateHelpers";
import { authStateListener } from "../lib/firebaseAuth";
import { fetchSnapshot, updateDocument } from "../lib/firebaseFirestore";
import { getExpenseTotal } from "../lib/helpers";
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
  const [monthlyTransactions, setMonthlyTransactions] = useState<
    TransactionItem[]
  >([]);
  const [lastTenDaysTransactions, setLastTenDaysTransactions] = useState<
    TransactionItem[]
  >([]);
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
      options?: FetchOption | null,
      transform?: (data: T[]) => T[]
    ) => {
      const whereClauses = options?.whereClauses || [];
      const unsubscribe = fetchSnapshot<T>(
        collectionName,
        {
          limit: options?.limit || undefined,
          ids: options?.ids || undefined,
          orderByField: options?.orderByField || undefined,
          orderDirection: options?.orderDirection || undefined,
          whereClauses: [
            {
              field: "sharedAccounId",
              value: user.sharedAccounId,
              operator: "==",
            },
            ...whereClauses,
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
    fetchData<WalletItem>(COLLECTION_WALLETS, setWallets);
    fetchData<ExpenseItem>(COLLECTION_EXPENSES, setExpenses);
    fetchData<WishListItem>(COLLECTION_WISHLISTS, setWishlists, null, (data) =>
      data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    );

    const [start, end] = getStartEndMonthDays(new Date());
    fetchData<TransactionItem>(
      COLLECTION_TRANSACTIONS,
      setMonthlyTransactions,
      {
        whereClauses: [
          {
            field: "date",
            operator: ">=",
            value: start,
          },
          {
            field: "date",
            operator: "<=",
            value: end,
          },
        ],
      }
    );

    const today = new Date();
    const lastTenDays = addDays(today, -10);
    fetchData<TransactionItem>(
      COLLECTION_TRANSACTIONS,
      setLastTenDaysTransactions,
      {
        orderByField: "date",
        whereClauses: [
          {
            field: "date",
            operator: ">=",
            value: startOfDay(lastTenDays),
          },
          {
            field: "date",
            operator: "<=",
            value: endOfDay(today),
          },
        ],
      },
      (data) =>
        data.sort(
          (a, b) =>
            convertToDate(b.date).getTime() - convertToDate(a.date).getTime()
        )
    );

    return () => subscriptions.forEach((unsubscribe) => unsubscribe());
  }, [user]);

  useEffect(() => {
    if (wallets.length === 1) setWallet(wallets[0]);
    else setWallet(null);
  }, [wallets]);

  useEffect(() => {
    const updateNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      for (const exp of expenses) {
        if (exp.notificationEnabled) {
          const [h, m] = getHourMinute(exp.notificationTime);
          const thisMonth = getCurrentMonthString(new Date());
          const [, datesThisMonth] = getExpenseTotal(exp, thisMonth);
          const nextMonth = getCurrentMonthString(addMonths(new Date(), 1));
          const [, datesNextMonth] = getExpenseTotal(exp, nextMonth);

          const allDates = [...datesThisMonth, ...datesNextMonth];
          let dateTimes = allDates.map((dat) =>
            setMinutes(setHours(dat, parseInt(h)), parseInt(m))
          );

          dateTimes = dateTimes.filter((dat) =>
            isBefore(addMinutes(new Date(), 1), dat)
          );

          for (const date of dateTimes) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `Reminder ⏰: Payment due for ${exp.name}.`,
                body: "Your expense payment is due. Plan ahead to stay on track! 💰",
                sound: "default",
              },
              trigger: { date },
            });
          }
        }
      }
    };

    updateNotifications();
  }, [expenses]);

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
        monthlyTransactions,
        user,
        locations,
        products,
        wishlists,
        wallet,
        expenses,
        lastTenDaysTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
