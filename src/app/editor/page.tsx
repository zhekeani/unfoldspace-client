"use client";

import StoryEditorContainer from "@/components/containers/StoryEditorContainer";
import { StoryEditorProvider } from "@/components/context/StoryEditorContext";
import { fetchActiveUserOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import { fetchStoryByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { fetchAllTopicsOnClient } from "@/lib/component-fetches/topic/fetchTopicsClient";
import { ServiceUser, Story, Topic } from "@/types/database.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const StoryEditorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId = searchParams.get("storyId");
  const initialFetch = useRef(true);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeUser, setActiveUser] = useState<ServiceUser | null>(null);
  const [initialStory, setInitialStory] = useState<Story | null>(null);

  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const fetchTopics = async () => {
      if (initialFetch.current) {
        const [topicsRes, userRes] = await Promise.all([
          fetchAllTopicsOnClient(),
          fetchActiveUserOnClient(),
        ]);

        if (storyId) {
          const storyRes = await fetchStoryByIdOnClient(storyId);

          if (!storyRes) {
            router.push("/");
          }

          setInitialStory(storyRes);
        }

        if (!userRes || !topicsRes || topicsRes.topics.length === 0) {
          router.push("/");
        }

        setTopics(topicsRes?.topics || []);
        setActiveUser(userRes?.serviceUser || null);

        initialFetch.current = false;
      }
    };
    fetchTopics();
  }, [router, storyId]);

  useEffect(() => {}, [activeUser, topics, router]);

  if (!activeUser || topics.length === 0) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StoryEditorProvider
        topics={topics}
        activeUserId={activeUser?.id}
        initialStoryId={storyId}
        initialCoverImage={initialStory?.cover_image || null}
      >
        <StoryEditorContainer
          pageData={storyId ? { story: initialStory!, storyId: storyId } : null}
          activeUser={activeUser}
          topics={topics}
        />
      </StoryEditorProvider>
    </QueryClientProvider>
  );
};

export default StoryEditorPage;
