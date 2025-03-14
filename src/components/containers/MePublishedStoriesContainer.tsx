"use client";

import GeneralPagination from "@/components/pagination/GeneralPagination";
import StoryPublishedItem from "@/components/story/StoryPublishedItem";
import { fetchUserStoriesByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { Story } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

type MePublishedStoriesContainerProps = {
  stories: Story[];
  activeUserId: string;
  activeUserUsername: string;
  limit: number;
  hasNextPage: boolean;
  currentPage: number;
  storiesCount: number;
};

const InnerMePublishedStoriesContainer = ({
  stories: initialStories,
  storiesCount: initialStoriesCount,
  hasNextPage: initialHasNextPage,
  limit,
  currentPage,
  activeUserId,
}: MePublishedStoriesContainerProps) => {
  const queryClient = useQueryClient();
  const storiesQueryKey = useMemo(
    () => ["stories", activeUserId],
    [activeUserId]
  );

  const { data: storiesRes, error: storiesError } = useQuery({
    queryKey: storiesQueryKey,
    queryFn: () =>
      fetchUserStoriesByIdOnClient(activeUserId, limit, currentPage),
    initialData: {
      stories: initialStories,
      hasNextPage: initialHasNextPage,
      storiesCount: initialStoriesCount,
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    queryClient.setQueryData(storiesQueryKey, () => {
      return {
        stories: initialStories,
        hasNextPage: initialHasNextPage,
        storiesCount: initialStoriesCount,
      };
    });
  }, [
    initialHasNextPage,
    initialStoriesCount,
    queryClient,
    currentPage,
    activeUserId,
    initialStories,
    storiesQueryKey,
  ]);

  if (storiesError || !storiesRes) return null;

  const { stories, hasNextPage, storiesCount } = storiesRes;

  return (
    <>
      <div
        style={{ minHeight: "calc(100vh - 260px)" }}
        className="w-full px-6 pb-2"
      >
        {stories.length === 0 && (
          <p className="text-center text-sub-text mt-[100px]">
            No saved reading lists found
          </p>
        )}
        {stories.length > 0 && (
          <div className="w-full flex flex-col gap-4 items-start min-h-[400px]">
            {stories.map((story) => (
              <StoryPublishedItem
                key={story.id}
                story={story}
                storiesQueryKey={storiesQueryKey}
              />
            ))}
          </div>
        )}
      </div>
      {stories.length > 0 && hasNextPage && (
        <div className="my-6">
          <GeneralPagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            itemsCount={storiesCount}
          />
        </div>
      )}
    </>
  );
};

const MePublishedStoriesContainer = (
  props: MePublishedStoriesContainerProps
) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerMePublishedStoriesContainer {...props} />
    </QueryClientProvider>
  );
};

export default MePublishedStoriesContainer;
