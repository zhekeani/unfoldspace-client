import { createContext, useContext, useState, ReactNode } from "react";

export type ListDetailActionType = "remove" | "reorder" | null;

type ReadingListDetailContextType = {
  pageActionType: ListDetailActionType;
  setPageActionType: (action: ListDetailActionType) => void;
  listItemsQueryKey: string[];
  listDetailQueryKey: string[];
};

const ReadingListDetailContext = createContext<
  ReadingListDetailContextType | undefined
>(undefined);

type ReadingListDetailProviderProps = {
  children: ReactNode;
  initialPageActionType?: ListDetailActionType;
  listItemsQueryKey: string[];
  listDetailQueryKey: string[];
};

export const ReadingListDetailProvider = ({
  children,
  listDetailQueryKey,
  listItemsQueryKey,
  initialPageActionType = null,
}: ReadingListDetailProviderProps) => {
  const [pageActionType, setPageActionType] = useState<ListDetailActionType>(
    initialPageActionType
  );

  return (
    <ReadingListDetailContext.Provider
      value={{
        pageActionType,
        listDetailQueryKey,
        listItemsQueryKey,
        setPageActionType,
      }}
    >
      {children}
    </ReadingListDetailContext.Provider>
  );
};

export const useReadingListDetail = () => {
  const context = useContext(ReadingListDetailContext);
  if (!context) {
    throw new Error(
      "useReadingListDetail must be used within a ReadingListDetailProvider"
    );
  }
  return context;
};
