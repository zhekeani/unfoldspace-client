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
import MeListsPrimarySubheader from "../header/protected-header/MeListsPrimarySubheader";

type MeReadingListsContainerProps = {
  readingLists: ExtendedReadingList[];
  activeUserId: string;
  activeUserUsername: string;
  limit: number;
  hasNextPage: boolean;
  currentPage: number;
  readingListsCount: number;
};

const InnerMeReadingListsContainer = ({
  readingLists: initialReadingLists,
  hasNextPage: initialHasNextPage,
  readingListsCount: initialListsCount,
  activeUserId,
  activeUserUsername: username,
  limit,
  currentPage,
  queryKey,
}: MeReadingListsContainerProps & { queryKey: string[] }) => {
  const queryClient = useQueryClient();

  const { data: readingListsRes, error: readingListsError } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      fetchUserDetailedReadingListsByIdOnClient(
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
    currentPage,
    initialReadingLists,
    activeUserId,
    queryKey,
  ]);

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

const MeReadingListsContainer = (props: MeReadingListsContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const queryKey = useMemo(
    () => ["reading_lists", props.activeUserId],
    [props.activeUserId]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MeListsPrimarySubheader queyKey={queryKey} />
      <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
        <div style={{ minHeight: "calc(100vh - 400px)" }}>
          <InnerMeReadingListsContainer {...props} queryKey={queryKey} />
        </div>
      </main>
    </QueryClientProvider>
  );
};

export default MeReadingListsContainer;
