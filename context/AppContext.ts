import { createContext } from "react";

interface AppContextType {
  user: User | null;
  locations: LocationItem[];
  products: ProductItem[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
