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
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

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
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ["reading_lists", username], [username]);
  const { data: readingListsRes, error: readingListsError } = useQuery({
    queryKey: queryKey,
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
  useEffect(() => {
    queryClient.setQueryData(queryKey, () => {
      return {
        readingLists: initialReadingLists,
        hasNextPage: initialHasNextPage,
        readingListsCount: initialListsCount,
      };
    });
  }, [
    initialHasNextPage,
    initialListsCount,
    queryClient,
    username,
    currentPage,
    initialReadingLists,
    queryKey,
  ]);

  if (readingListsError || !readingListsRes) return null;

  const { readingLists, hasNextPage, readingListsCount } = readingListsRes;

  return (
    <>
      <div className="w-full px-6 pb-2 ">
        {readingLists.length === 0 && (
          <p className="text-center text-sub-text mt-[100px]">
            No public reading lists found
          </p>
        )}
        {readingLists.length > 0 && (
          <div className="w-full flex flex-col gap-9 items-center min-h-[400px]">
            {readingLists.map((readingList) => (
              <ReadingListItem
                readingListsQueryKey={queryKey}
                username={username}
                key={readingList.id}
                initialReadingList={readingList}
                isOwned={readingList.user_id === activeUserId}
              />
            ))}
          </div>
        )}
      </div>
      {readingListsCount > 0 && hasNextPage && (
        <div className="my-6">
          <GeneralPagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            itemsCount={readingListsCount}
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
