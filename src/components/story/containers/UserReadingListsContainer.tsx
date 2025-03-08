"use client";

import GeneralPagination from "@/components/pagination/GeneralPagination";
import ReadingListItem, {
  ExtendedReadingList,
} from "@/components/reading-list/ReadingListItem";
import { fetchUserDetailedReadingListsByIdOnClient } from "@/lib/component-fetches/reading-list/fetchReadingListsClient";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

type UserReadingListsContainerProps = {
  readingLists: ExtendedReadingList[];
  activeUserId: string;
  targetUserId: string;
  username: string;
  limit: number;
  hasNextPage: boolean;
  currentPage: number;
  readingListsCount: number;
};

const InnerUserReadingListsContainer = ({
  readingLists: initialReadingLists,
  hasNextPage: initialHasNextPage,
  readingListsCount: initialListsCount,
  activeUserId,
  targetUserId,
  username,
  limit,
  currentPage,
}: UserReadingListsContainerProps) => {
  const { data: readingListsRes, error: readingListsError } = useQuery({
    queryKey: ["reading_lists", username],
    queryFn: () =>
      fetchUserDetailedReadingListsByIdOnClient(
        targetUserId,
        limit,
        currentPage
      ),
    initialData: {
      readingLists: initialReadingLists,
      hasNextPage: initialHasNextPage,
      readingListsCount: initialListsCount,
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });

  if (readingListsError || !readingListsRes) return null;

  const { readingLists, hasNextPage, readingListsCount } = readingListsRes;

  return (
    <>
      <div className="w-full px-6 pb-2">
        {readingLists.length === 0 && (
          <p className="text-center text-sub-text mt-[100px]">
            No public reading lists found
          </p>
        )}
        {readingLists.length > 0 && (
          <div className="w-full flex flex-col gap-9 items-center">
            {readingLists.map((readingList) => (
              <ReadingListItem
                username={username}
                key={readingList.id}
                initialReadingList={readingList}
                isOwned={readingList.user_id === activeUserId}
              />
            ))}
          </div>
        )}
      </div>
      {readingListsCount > 0 && (
        <div className="my-6">
          <GeneralPagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            storiesCount={readingListsCount}
          />
        </div>
      )}
    </>
  );
};

const UserReadingListsContainer = (props: UserReadingListsContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerUserReadingListsContainer {...props} />
    </QueryClientProvider>
  );
};

export default UserReadingListsContainer;
