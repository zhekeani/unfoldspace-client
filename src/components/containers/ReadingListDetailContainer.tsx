"use client";

import {
  ListDetailActionType,
  ReadingListDetailProvider,
} from "@/components/context/ReadingListDetailContext";
import ReadingListDetailSubheader from "@/components/header/protected-header/ReadingListDetailSubheader";
import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { ReadingListDetail, ServiceUser } from "@/types/database.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ListDetailResponsesContainer from "./ListDetailResponsesContainer";
import ReadingListDetailItemsContainer from "./ReadingListDetailItemsContainer";

type ReadingListDetailContainerProps = {
  listItems: ExtendedReadingListItem[];
  readingList: ReadingListDetail;
  hasNextPage: boolean;
  activeUser: ServiceUser;
  listItemsCount: number;
  limit: number;
  currentPage: number;
  username: string;
  pageActionType: ListDetailActionType;
};

const InnerReadingListDetailContainer = ({
  readingList,
  activeUser,
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
  const responsesQueryKey = ["responses", readingList.id];

  return (
    <ReadingListDetailProvider
      initialPageActionType={pageActionType}
      listDetailQueryKey={listDetailQueryKey}
      listItemsQueryKey={listItemsQueryKey}
      responsesQueryKey={responsesQueryKey}
    >
      <div className="h-full ">
        <ReadingListDetailSubheader
          readingList={readingList}
          activeUserId={activeUser.id}
        />
        <ReadingListDetailItemsContainer
          activeUserId={activeUser.id}
          isOwned={activeUser.id === readingList.user_id}
          listId={readingList.id}
          listItems={listItems}
          listItemsCount={listItemsCount}
          limit={limit}
          page={currentPage}
          hasNextPage={hasNextPage}
        />
        <ListDetailResponsesContainer
          listId={readingList.id}
          activeUser={activeUser}
          ownerId={readingList.user_id}
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
