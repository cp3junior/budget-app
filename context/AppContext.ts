import { createContext } from "react";

interface AppContextType {
  user: User | null;
  locations: LocationItem[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
