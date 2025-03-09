"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchActiveUserDraftsOnClient } from "../../../lib/component-fetches/story/fetchStoriesClient";
import GeneralPagination from "../../pagination/GeneralPagination";
import StoryDraftItem, { StoryDraft } from "../StoryDraftItem";

type MeDraftsContainerProps = {
  drafts: StoryDraft[];
  draftsCount: number;
  activeUserId: string;
  activeUserUsername: string;
  limit: number;
  hasNextPage: boolean;
  currentPage: number;
};

const InnerMeDraftsContainer = ({
  drafts: initialDrafts,
  hasNextPage: initialHasNextPage,
  draftsCount: initialDraftsCount,
  activeUserId,
  limit,
  currentPage,
}: MeDraftsContainerProps) => {
  const queryClient = useQueryClient();
  const { data: draftsRes, error: draftsError } = useQuery({
    queryKey: ["drafts", activeUserId],
    queryFn: () =>
      fetchActiveUserDraftsOnClient(activeUserId, limit, currentPage),
    initialData: {
      drafts: initialDrafts,
      hasNextPage: initialHasNextPage,
      draftsCount: initialDraftsCount,
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    queryClient.setQueryData(["drafts", activeUserId], () => {
      return {
        drafts: initialDrafts,
        hasNextPage: initialHasNextPage,
        draftsCount: initialDraftsCount,
      };
    });
  }, [
    initialHasNextPage,
    queryClient,
    currentPage,
    activeUserId,
    initialDrafts,
    initialDraftsCount,
  ]);

  if (draftsError || !draftsRes) return null;

  const { draftsCount, hasNextPage, drafts } = draftsRes;

  return (
    <>
      <div className="w-full px-6 pb-2">
        {drafts.length === 0 && (
          <p className="text-center text-sub-text mt-[100px]">
            You don&apos;t have any story draft.
          </p>
        )}
        {drafts.length > 0 && (
          <div className="w-full flex flex-col gap-4 items-start min-h-[400px]">
            {drafts.map((draft) => (
              <StoryDraftItem key={draft.id} draft={draft} />
            ))}
          </div>
        )}
      </div>
      {draftsCount > 0 && hasNextPage && (
        <div className="my-6">
          <GeneralPagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            itemsCount={draftsCount}
          />
        </div>
      )}
    </>
  );
};

const MeDraftsContainer = (props: MeDraftsContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerMeDraftsContainer {...props} />
    </QueryClientProvider>
  );
};

export default MeDraftsContainer;
