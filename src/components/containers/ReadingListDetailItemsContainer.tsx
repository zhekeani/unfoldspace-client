import { useQuery } from "@tanstack/react-query";
import { fetchListItemsByListIdOnClient } from "../../lib/component-fetches/reading-list-item/fetchReadingListItemsClient";
import { useReadingListDetail } from "../context/ReadingListDetailContext";
import GeneralPagination from "../pagination/GeneralPagination";
import ReadingListStoryItem, {
  ExtendedReadingListItem,
} from "../reading-list/ReadingListStoryItem";
import ListItemsRemoveContainer from "./components/ListItemsRemoveContainer";
import ListItemsReorderContainer from "./components/ListItemsReorderContainer";

type ContainerProps = {
  listItems: ExtendedReadingListItem[];
  isOwned: boolean;
  activeUserId: string;
  listId: string;
  limit: number;
  page: number;
  hasNextPage: boolean;
  listItemsCount: number;
};

const ReadingListDetailItemsContainer = ({
  listItems: initialListItems,
  hasNextPage: initialHasNextPage,
  listItemsCount: initialItemsCount,
  isOwned,
  activeUserId,
  listId,
  limit,
  page,
}: ContainerProps) => {
  const { listItemsQueryKey, pageActionType } = useReadingListDetail();

  const { data: listItemsData, error: itemListsError } = useQuery({
    queryKey: listItemsQueryKey,
    queryFn: () => fetchListItemsByListIdOnClient(listId, limit, page),
    initialData: {
      listItems: initialListItems,
      hasNextPage: initialHasNextPage,
      listItemsCount: initialItemsCount,
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (itemListsError || !listItemsData) {
    console.error(itemListsError);
    return null;
  }

  const { listItems, hasNextPage, listItemsCount } = listItemsData;
  const isReorder = pageActionType === "reorder";
  const isRemove = pageActionType === "remove";

  return (
    <>
      {!pageActionType && (
        <>
          <div
            style={{ minHeight: "calc(100vh - 260px)" }}
            className="pt-[8px] pb-2 flex-1 flex flex-col gap-6 min-h-[400px]"
          >
            {listItems.length === 0 ? (
              <p className="text-center text-sub-text mt-[100px]">
                No item found.
              </p>
            ) : (
              listItems.map((listItem) => (
                <ReadingListStoryItem
                  key={listItem.id}
                  listItem={listItem}
                  isOwned={isOwned}
                  activeUserId={activeUserId}
                />
              ))
            )}
          </div>
          {listItemsCount > 0 && hasNextPage && (
            <div className="my-6">
              <GeneralPagination
                currentPage={page}
                hasNextPage={hasNextPage}
                itemsCount={listItemsCount}
              />
            </div>
          )}
        </>
      )}
      {isReorder && <ListItemsReorderContainer listItems={listItems} />}
      {isRemove && <ListItemsRemoveContainer listItems={listItems} />}
    </>
  );
};

export default ReadingListDetailItemsContainer;
