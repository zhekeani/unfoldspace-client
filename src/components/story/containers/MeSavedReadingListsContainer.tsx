"use client";

import GeneralPagination from "@/components/pagination/GeneralPagination";
import ReadingListItem, {
  ExtendedReadingList,
} from "@/components/reading-list/ReadingListItem";
import { fetchActiveUserSavedReadingListsOnClient } from "@/lib/component-fetches/reading-list/fetchReadingListsClient";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

type MeSavedReadingListsContainerProps = {
  readingLists: ExtendedReadingList[];
  activeUserId: string;
  activeUserUsername: string;
  limit: number;
  hasNextPage: boolean;
  currentPage: number;
  readingListsCount: number;
};

const InnerMeSavedReadingListsContainer = ({
  readingLists: initialReadingLists,
  hasNextPage: initialHasNextPage,
  readingListsCount: initialListsCount,
  activeUserId,
  activeUserUsername: username,
  limit,
  currentPage,
}: MeSavedReadingListsContainerProps) => {
  const queryClient = useQueryClient();
  const { data: readingListsRes, error: readingListsError } = useQuery({
    queryKey: ["saved_reading_lists", activeUserId],
    queryFn: () =>
      fetchActiveUserSavedReadingListsOnClient(
        activeUserId,
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
    queryClient.setQueryData(["saved_reading_lists", activeUserId], () => {
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
    currentPage,
    initialReadingLists,
    activeUserId,
  ]);

  if (readingListsError || !readingListsRes) return null;

  const { readingLists, hasNextPage, readingListsCount } = readingListsRes;

  return (
    <>
      <div className="w-full px-6 pb-2">
        {readingLists.length === 0 && (
          <p className="text-center text-sub-text mt-[100px]">
            No saved reading lists found
          </p>
        )}
        {readingLists.length > 0 && (
          <div className="w-full flex flex-col gap-9 items-center min-h-[400px]">
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
      {readingListsCount > 0 && hasNextPage && (
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

const MeSavedReadingListsContainer = (
  props: MeSavedReadingListsContainerProps
) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerMeSavedReadingListsContainer {...props} />
    </QueryClientProvider>
  );
};

export default MeSavedReadingListsContainer;
