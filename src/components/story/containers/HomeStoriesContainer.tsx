"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import StoryItem, { StoryItemStory } from "../StoryItem";

type HomeStoriesContainerProps = {
  stories: StoryItemStory[];
  activeUserId: string;
};

const InnerHomeStoriesContainer = ({
  stories,
  activeUserId,
}: HomeStoriesContainerProps) => {
  return (
    <div className="pt-[50px] flex-1 flex flex-col gap-6">
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
          />
        ))
      )}
    </div>
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
