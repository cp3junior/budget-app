import { createContext } from "react";

interface AppContextType {
  user: User | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
