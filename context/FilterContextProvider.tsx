import { addDays } from "date-fns";
import { ReactNode, useState } from "react";
import { FilterContext } from "./FilterContext";

interface FilterContextProviderProps {
  children: ReactNode;
}

export const FilterContextProvider = ({
  children,
}: FilterContextProviderProps) => {
  const today = new Date();
  const lastTenDays = addDays(today, -30);
  const [startDate, setStartDate] = useState(lastTenDays);
  const [endDate, setEndDate] = useState(today);
  const [categoryId, setCategoryId] = useState(0);
  const [transactionTypeId, setTransactionTypeId] = useState(0);
  const [transactionDirectionId, setTransactionDirectionId] = useState(2);

  return (
    <FilterContext.Provider
      value={{
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        categoryId,
        setCategoryId,
        transactionTypeId,
        setTransactionTypeId,
        transactionDirectionId,
        setTransactionDirectionId,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
