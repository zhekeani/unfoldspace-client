"use client";

import GeneralPagination from "@/components/pagination/GeneralPagination";
import { fetchUserStoriesByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { Story } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import StoryPublishedItem from "../StoryPublishedItem";

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
  const { data: storiesRes, error: storiesError } = useQuery({
    queryKey: ["stories"],
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
    queryClient.setQueryData(["saved_reading_lists", activeUserId], () => {
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
  ]);

  if (storiesError || !storiesRes) return null;

  const { stories, hasNextPage, storiesCount } = storiesRes;

  return (
    <>
      <div className="w-full px-6 pb-2">
        {stories.length === 0 && (
          <p className="text-center text-sub-text mt-[100px]">
            No saved reading lists found
          </p>
        )}
        {stories.length > 0 && (
          <div className="w-full flex flex-col gap-9 items-start min-h-[400px]">
            {stories.map((story) => (
              <StoryPublishedItem key={story.id} story={story} />
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
