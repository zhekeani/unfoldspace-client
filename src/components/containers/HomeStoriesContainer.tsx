"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import StoryItem, { StoryItemStory } from "../story/StoryItem";
import { fetchStoriesByTopicOnClient } from "../../lib/component-fetches/story/fetchStoriesClient";
import GeneralPagination from "../pagination/GeneralPagination";

type HomeStoriesContainerProps = {
  topic: string | undefined;
  stories: StoryItemStory[];
  activeUserId: string;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  storiesCount: number;
};

const InnerHomeStoriesContainer = ({
  stories: initialStories,
  hasNextPage: initialHasNextPage,
  storiesCount: initialStoriesCount,
  activeUserId,
  limit,
  currentPage,
  topic,
}: HomeStoriesContainerProps) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["stories", topic ?? "all"], [topic]);

  const { data: storiesRes, error: storiesError } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchStoriesByTopicOnClient(topic, limit, currentPage),
    initialData: {
      stories: initialStories,
      hasNextPage: initialHasNextPage,
      storiesCount: initialStoriesCount,
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    queryClient.setQueryData(queryKey, () => {
      return {
        stories: initialStories,
        hasNextPage: initialHasNextPage,
        storiesCount: initialStoriesCount,
      };
    });
  }, [
    initialHasNextPage,
    initialStories,
    initialStoriesCount,
    queryClient,
    queryKey,
    topic,
  ]);

  if (storiesError || !storiesRes) {
    console.error(storiesError);
    return null;
  }

  const { stories, hasNextPage, storiesCount } = storiesRes;

  return (
    <>
      <div className="pt-[40px] flex-1 flex flex-col gap-6">
        {stories.length === 0 ? (
          <p className="text-center text-sub-text mt-[100px]">
            No stories found.
          </p>
        ) : (
          stories.map((story) => (
            <StoryItem
              key={story.id}
              initialStory={story}
              isOwned={activeUserId === story.user_id}
              activeUserId={activeUserId}
              storiesQueryKey={queryKey}
            />
          ))
        )}
      </div>
      {storiesCount > 0 && (
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

const HomeStoriesContainer = (props: HomeStoriesContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerHomeStoriesContainer {...props} />
    </QueryClientProvider>
  );
};

export default HomeStoriesContainer;
