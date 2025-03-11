import { createContext, ReactNode, useContext, useState } from "react";
import { ReadingListItem } from "../../types/database.types";

export type ListDetailActionType = "remove" | "reorder" | null;

type ReorderedItem = Pick<ReadingListItem, "id" | "item_order">;

const checkIsOrderChange = (listItems: ReorderedItem[]) => {
  for (let i = 1; i < listItems.length; i++) {
    if (listItems[i].item_order! > listItems[i - 1].item_order!) {
      return true;
    }
  }
  return false;
};

type ReadingListDetailContextType = {
  pageActionType: ListDetailActionType;
  setPageActionType: (action: ListDetailActionType) => void;
  listItemsQueryKey: string[];
  listDetailQueryKey: string[];

  reorderedListItems: ReorderedItem[] | null;
  isOrderChange: boolean;
  setReorderedItems: (items: ReorderedItem[]) => void;
  resetReorderedItems: () => void;
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
  const [reorderedItems, setReorderedItems] = useState<ReorderedItem[] | null>(
    null
  );
  const isOrderChange = reorderedItems
    ? checkIsOrderChange(reorderedItems)
    : false;

  return (
    <ReadingListDetailContext.Provider
      value={{
        pageActionType,
        listDetailQueryKey,
        listItemsQueryKey,
        setPageActionType,

        reorderedListItems: reorderedItems,
        isOrderChange,
        setReorderedItems,
        resetReorderedItems: () => setReorderedItems(null),
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
