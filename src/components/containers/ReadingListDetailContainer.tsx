"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReadingListDetail } from "../../types/database.types";
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
};

const InnerReadingListDetailContainer = ({
  readingList,
  activeUserId,
  listItems,
  hasNextPage,
  listItemsCount,
  limit,
  currentPage,
}: ReadingListDetailContainerProps) => {
  const listDetailQueryKey = ["reading_list_detail", readingList.id];

  return (
    <div>
      <ReadingListDetailSubheader
        listDetailQueryKey={listDetailQueryKey}
        readingList={readingList}
        activeUserId={activeUserId}
      />
      <ReadingListDetailItemsContainer
        listDetailQueryKey={listDetailQueryKey}
        activeUserId={activeUserId}
        listId={readingList.id}
        listItems={listItems}
        limit={limit}
        page={currentPage}
        listItemsCount={listItemsCount}
        hasNextPage={hasNextPage}
        isOwned={activeUserId === readingList.user_id}
      />
    </div>
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
