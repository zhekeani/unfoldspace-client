"use client";

import { fetchActiveUserLastSavedStoriesOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { Story } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import SidebarStoryItem from "./SidebarStoryItem";
import SideBarSubsectionWrapper from "./SidebarSubsectionWrapper";

type SidebarLastSavedStoriesSectionProps = {
  initialStories: Story[];
  activeUserId: string;
};

const InnerSidebarLastSavedStoriesSection = ({
  initialStories,
  activeUserId,
}: SidebarLastSavedStoriesSectionProps) => {
  const { data: stories, error: storiesError } = useQuery({
    queryKey: ["stories", activeUserId],
    queryFn: () => fetchActiveUserLastSavedStoriesOnClient(),
    initialData: initialStories,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (!stories || storiesError) {
    console.error(storiesError);
    return null;
  }

  return (
    <SideBarSubsectionWrapper heading="Lastly saved">
      <div className="mb-4 flex flex-col gap-5">
        {stories.map((story, index) => (
          <SidebarStoryItem
            key={`${story.id}_${index}`}
            story={story}
            activeUserId={activeUserId}
          />
        ))}
      </div>
      <Link
        href={"/me/lists"}
        className="text-sub-text text-sm hover:underline"
      >
        See all({stories.length})
      </Link>
    </SideBarSubsectionWrapper>
  );
};

const SidebarLastSavedStoriesSection = (
  props: SidebarLastSavedStoriesSectionProps
) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerSidebarLastSavedStoriesSection {...props} />
    </QueryClientProvider>
  );
};

export default SidebarLastSavedStoriesSection;
