"use client";

import {
  StoryDetailProvider,
  useStoryDetail,
} from "@/components/context/StoryDetailContext";
import StoryDetailSubheader from "@/components/header/protected-header/StoryDetailSubheader";
import StoryDetailActionsBar from "@/components/header/protected-header/components/StoryDetailActionsBar";
import StoryDetailAuthorInfo from "@/components/header/protected-header/components/StoryDetailAuthorInfo";
import { fetchUserByUsernameOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import {
  fetchStoryDetailByIdOnClient,
  fetchTopicsByStoryOnClient,
} from "@/lib/component-fetches/story/fetchStoryClient";
import { StoryDetail, Topic, UserWFollowStatus } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useQueries,
} from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

// import "@/styles/editor/editor.index.css";

type StoryDetailContainerProps = {
  activeUserId: string;
  story: StoryDetail;
  topics: Topic[];
  user: UserWFollowStatus;
};

const InnerStoryDetailContainer = ({
  activeUserId,
  story: initialStory,
  topics: initialTopics,
  user: initialUser,
}: StoryDetailContainerProps) => {
  const { storyDetailQueryKey, topicsQueryKey, userQueryKey } =
    useStoryDetail();

  const [storyRes, topicsRes, userRes] = useQueries({
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
        queryKey: topicsQueryKey,
        queryFn: () => fetchTopicsByStoryOnClient(initialStory.id),
        initialData: { topics: initialTopics },
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

  if (
    storyRes.error ||
    !storyRes.data ||
    topicsRes.error ||
    !topicsRes.data ||
    userRes.error ||
    !userRes.data
  ) {
    return null;
  }

  const story = storyRes.data;
  const { topics } = topicsRes.data;
  const { data: user } = userRes;

  return (
    <div className="mx-4 story-editor mb-8">
      <StoryDetailSubheader
        story={story}
        user={user}
        isOwned={story.user_id === activeUserId}
      />
      <StoryDetailActionsBar activeUserId={activeUserId} story={story} />
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
        activeUserId={activeUserId}
        story={story}
        collapsible={false}
      />
      <StoryDetailAuthorInfo
        isOwned={activeUserId === story.user_id}
        user={user}
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
