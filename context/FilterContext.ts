import { createContext } from "react";

interface FilterContextType {
  startDate: Date;
  setStartDate: (d: Date) => void;
  endDate: Date;
  setEndDate: (d: Date) => void;
  categoryId: number;
  setCategoryId: (id: number) => void;
  transactionTypeId: number;
  setTransactionTypeId: (id: number) => void;
  transactionDirectionId: number;
  setTransactionDirectionId: (id: number) => void;
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);
