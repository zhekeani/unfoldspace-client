"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReadingListDetail } from "../../types/database.types";
import {
  ListDetailActionType,
  ReadingListDetailProvider,
} from "../context/ReadingListDetailContext";
import ReadingListDetailSubheader from "../header/protected-header/ReadingListDetailSubheader";
import { ExtendedReadingListItem } from "../reading-list/ReadingListStoryItem";
import ReadingListDetailItemsContainer from "./ReadingListDetailItemsContainer";

type ReadingListDetailContainerProps = {
  listItems: ExtendedReadingListItem[];
  readingList: ReadingListDetail;
  hasNextPage: boolean;
  activeUserId: string;
  listItemsCount: number;
  limit: number;
  currentPage: number;
  username: string;
  pageActionType: ListDetailActionType;
};

const InnerReadingListDetailContainer = ({
  readingList,
  activeUserId,
  listItems,
  hasNextPage,
  listItemsCount,
  limit,
  currentPage,
  pageActionType,
}: ReadingListDetailContainerProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const actionType = searchParams.get("actionType");

    if (actionType) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("actionType");

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const listItemsQueryKey = ["reading_list_items", readingList.id];
  const listDetailQueryKey = ["reading_list_detail", readingList.id];

  return (
    <ReadingListDetailProvider
      initialPageActionType={pageActionType}
      listDetailQueryKey={listDetailQueryKey}
      listItemsQueryKey={listItemsQueryKey}
    >
      <div>
        <ReadingListDetailSubheader
          readingList={readingList}
          activeUserId={activeUserId}
        />
        <ReadingListDetailItemsContainer
          activeUserId={activeUserId}
          isOwned={activeUserId === readingList.user_id}
          listId={readingList.id}
          listItems={listItems}
          listItemsCount={listItemsCount}
          limit={limit}
          page={currentPage}
          hasNextPage={hasNextPage}
        />
      </div>
    </ReadingListDetailProvider>
  );
};

const ReadingListDetailContainer = (props: ReadingListDetailContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerReadingListDetailContainer {...props} />
    </QueryClientProvider>
  );
};

export default ReadingListDetailContainer;
