import { createContext } from "react";

interface AppContextType {
  user: User | null;
  locations: LocationItem[];
  products: ProductItem[];
  wishlists: WishListItem[];
  expenses: ExpenseItem[];
  wallet: WalletItem | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
