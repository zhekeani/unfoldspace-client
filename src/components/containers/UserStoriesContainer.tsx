"use client";

import GeneralPagination from "@/components/pagination/GeneralPagination";
import { fetchUserStoriesWInteractionsByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import StoryItem, { StoryItemStory } from "../story/StoryItem";

type UserStoriesContainerProps = {
  stories: StoryItemStory[];
  activeUserId: string;
  activeUserUsername: string;
  targetUserId: string;
  limit: number;
  currentPage: number;
  hasNextPage: boolean;
  storiesCount: number;
};

const InnerUserStoriesContainer = ({
  stories: initialStories,
  hasNextPage: initialHasNextPage,
  storiesCount: initialStoriesCount,
  activeUserId,
  targetUserId,
  limit,
  currentPage,
}: UserStoriesContainerProps) => {
  const queryClient = useQueryClient();
  const { data: storiesRes, error: storiesError } = useQuery({
    queryKey: ["stories", targetUserId],
    queryFn: () =>
      fetchUserStoriesWInteractionsByIdOnClient(
        targetUserId,
        limit,
        currentPage
      ),
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
    queryClient.setQueryData(["stories", targetUserId], () => {
      return {
        stories: initialStories,
        hasNextPage: initialHasNextPage,
        storiesCount: initialStoriesCount,
      };
    });
  }, [
    initialHasNextPage,
    queryClient,
    currentPage,
    targetUserId,
    initialStories,
    initialStoriesCount,
  ]);

  if (storiesError || !storiesRes) {
    console.error(storiesError);
    return null;
  }

  const { stories, hasNextPage, storiesCount } = storiesRes;

  return (
    <>
      <div className="pt-[8px] pb-2 flex-1 flex flex-col gap-6 min-h-[400px]">
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
              showProfile={false}
            />
          ))
        )}
      </div>
      {storiesCount > 0 && hasNextPage && (
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

const UserStoriesContainer = (props: UserStoriesContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerUserStoriesContainer {...props} />
    </QueryClientProvider>
  );
};

export default UserStoriesContainer;
