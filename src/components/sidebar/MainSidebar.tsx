import Link from "next/link";

import { fetchMainSidebarData } from "@/lib/component-fetches/sidebar/mainSidebar";
import SidebarAdviceBanner from "./components/AdviceBanner";
import SidebarFooter from "./components/SidebarFooter";
import SidebarStoryItem from "./components/SidebarStoryItem";
import SideBarSubsectionWrapper from "./components/SidebarSubsectionWrapper";
import SidebarLastSavedStoriesSection from "./components/SidebarLastSavedStoriesSection";

const MainSidebar = async () => {
  const response = await fetchMainSidebarData();

  if (!response) {
    return null;
  }

  const { stories, topics, lastSavedStories, activeUserId } = response;

  return (
    <div className="w-[303px]">
      <SideBarSubsectionWrapper heading="Staff Picks">
        <div className="flex flex-col gap-4 mb-4">
          {stories.map((story) => (
            <SidebarStoryItem
              key={story.id}
              story={story}
              activeUserId={activeUserId}
            />
          ))}
        </div>
        <Link
          href={`/home?page`}
          className="text-sub-text text-sm hover:underline"
        >
          See the full list
        </Link>
      </SideBarSubsectionWrapper>

      <SidebarAdviceBanner />

      <SideBarSubsectionWrapper heading="Recommended topics">
        <div className="flex flex-wrap gap-2 mb-4">
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
        <Link
          href={"/explore-topics"}
          className="text-sub-text text-sm hover:underline"
        >
          See more topics
        </Link>
      </SideBarSubsectionWrapper>

      <SidebarLastSavedStoriesSection
        initialStories={lastSavedStories}
        activeUserId={activeUserId}
      />

      <SidebarFooter />
    </div>
  );
};

export default MainSidebar;
