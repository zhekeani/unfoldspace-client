import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { ReadingListItem } from "@/types/database.types";
import { createContext, ReactNode, useContext, useState } from "react";

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
  responsesQueryKey: string[];

  reorderedListItems: ReorderedItem[] | null;
  isOrderChange: boolean;
  setReorderedItems: (items: ReorderedItem[]) => void;
  resetReorderedItems: () => void;

  listItemsToRemove: ExtendedReadingListItem[] | null;
  hasItemToRemove: boolean;
  setItemsToRemove: (items: ExtendedReadingListItem[]) => void;
  resetItemsToRemove: () => void;

  isResSheetOpen: boolean;
  setResSheetOpen: (isOpen: boolean) => void;
};

const ReadingListDetailContext = createContext<
  ReadingListDetailContextType | undefined
>(undefined);

type ReadingListDetailProviderProps = {
  children: ReactNode;
  initialPageActionType?: ListDetailActionType;
  listItemsQueryKey: string[];
  listDetailQueryKey: string[];
  responsesQueryKey: string[];
};

export const ReadingListDetailProvider = ({
  children,
  listDetailQueryKey,
  listItemsQueryKey,
  initialPageActionType = null,
  responsesQueryKey,
}: ReadingListDetailProviderProps) => {
  const [isResSheetOpen, setResSheetOpen] = useState(false);
  const [pageActionType, setPageActionType] = useState<ListDetailActionType>(
    initialPageActionType
  );
  const [reorderedItems, setReorderedItems] = useState<ReorderedItem[] | null>(
    null
  );
  const [listItemsToRemove, setListItemsToRemove] = useState<
    ExtendedReadingListItem[] | null
  >(null);

  const isOrderChange = reorderedItems
    ? checkIsOrderChange(reorderedItems)
    : false;

  const hasItemToRemove = listItemsToRemove
    ? listItemsToRemove.length > 0
    : false;

  return (
    <ReadingListDetailContext.Provider
      value={{
        pageActionType,
        listDetailQueryKey,
        listItemsQueryKey,
        responsesQueryKey,
        setPageActionType,

        reorderedListItems: reorderedItems,
        isOrderChange,
        setReorderedItems,
        resetReorderedItems: () => setReorderedItems(null),

        listItemsToRemove,
        hasItemToRemove,
        setItemsToRemove: setListItemsToRemove,
        resetItemsToRemove: () => setListItemsToRemove(null),

        isResSheetOpen,
        setResSheetOpen,
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
