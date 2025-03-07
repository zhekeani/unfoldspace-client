"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import StoryItem, { StoryItemStory } from "../StoryItem";

type UserStoriesContainerProps = {
  stories: StoryItemStory[];
  activeUserId: string;
};

const InnerUserStoriesContainer = ({
  stories,
  activeUserId,
}: UserStoriesContainerProps) => {
  return (
    <div className="pt-[8px] flex-1 flex flex-col gap-6">
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
