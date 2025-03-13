"use client";

import {
  StoryDetailProvider,
  useStoryDetail,
} from "@/components/context/StoryDetailContext";
import StoryDetailSubheader from "@/components/header/protected-header/StoryDetailSubheader";
import StoryDetailActionsBar from "@/components/header/protected-header/components/StoryDetailActionsBar";
import StoryDetailAuthorInfo from "@/components/header/protected-header/components/StoryDetailAuthorInfo";
import { fetchUserByUsernameOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import { fetchStoryDetailByIdOnClient } from "@/lib/component-fetches/story/fetchStoryClient";
import {
  ServiceUser,
  StoryDetail,
  Topic,
  UserWFollowStatus,
} from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
} from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import StoryDetailResponsesContainer from "./StoryDetailResponsesContainer";

type StoryDetailContainerProps = {
  activeUser: ServiceUser;
  story: StoryDetail;
  topics: Topic[];
  user: UserWFollowStatus;
};

const InnerStoryDetailContainer = ({
  activeUser,
  story: initialStory,
  topics,
  user: initialUser,
}: StoryDetailContainerProps) => {
  const { storyDetailQueryKey, userQueryKey } = useStoryDetail();

  const [storyRes, userRes] = useQueries({
    queries: [
      {
        queryKey: storyDetailQueryKey,
        queryFn: () => fetchStoryDetailByIdOnClient(initialStory.id),
        initialData: initialStory,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: userQueryKey,
        queryFn: () => fetchUserByUsernameOnClient(initialUser.username),
        initialData: initialUser,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    ],
  });

  if (storyRes.error || !storyRes.data || userRes.error || !userRes.data) {
    return null;
  }

  const story = storyRes.data;
  const { data: user } = userRes;

  return (
    <div className="mx-4 story-editor mb-8">
      <StoryDetailSubheader
        story={story}
        user={user}
        isOwned={story.user_id === activeUser.id}
      />
      <StoryDetailActionsBar activeUserId={activeUser.id} story={story} />
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: story.html_content }}
      />
      <div className="flex flex-wrap gap-2 mt-6 mb-8">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={{
              pathname: "/home",
              query: { tag: topic.name },
            }}
            className="text-sm px-3 py-2 rounded-full bg-gray-100 text-main-text hover:bg-gray-200 transition-colors"
          >
            {topic.name}
          </Link>
        ))}
      </div>
      <StoryDetailActionsBar
        activeUserId={activeUser.id}
        story={story}
        collapsible={false}
      />
      <StoryDetailAuthorInfo
        isOwned={activeUser.id === story.user_id}
        user={user}
      />
      <StoryDetailResponsesContainer
        storyId={story.id}
        activeUser={activeUser}
      />
    </div>
  );
};

const StoryDetailContainer = (props: StoryDetailContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const storyDetailQueryKey = ["story_detail", props.story.id];
  const topicsQueryKey = ["topics", props.story.id];
  const userQueryKey = ["user", props.user.id];
  const responsesQueryKey = ["responses", props.story.id];

  return (
    <QueryClientProvider client={queryClient}>
      <StoryDetailProvider
        storyDetailQueryKey={storyDetailQueryKey}
        topicsQueryKey={topicsQueryKey}
        userQueryKey={userQueryKey}
        responsesQueryKey={responsesQueryKey}
      >
        <InnerStoryDetailContainer {...props} />
      </StoryDetailProvider>
    </QueryClientProvider>
  );
};

export default StoryDetailContainer;
