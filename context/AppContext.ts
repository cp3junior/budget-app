import { createContext } from "react";

interface AppContextType {
  user: User | null;
  locations: LocationItem[];
  products: ProductItem[];
  wishlists: WishListItem[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
