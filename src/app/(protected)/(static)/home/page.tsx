import TopicsCarousel from "@/components/carousel/TopicCarousel";
import HomeStoriesContainer from "@/components/containers/HomeStoriesContainer";
import GeneralPagination from "@/components/pagination/GeneralPagination";
import { StoryItemStory } from "@/components/story/StoryItem";
import { fetchStoriesByTopicOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { fetchHomeTopicsOnServer } from "@/lib/component-fetches/topic/fetchTopicsServer";
import { Topic } from "@/types/database.types";
import { fetchActiveUserOnServer } from "../../../../lib/component-fetches/service-user/fetchUserServer";

type SearchParams = {
  tag?: string;
  page?: string;
};

const fetchHomePageInitialData = async (
  topic: string | undefined,
  limit: number,
  page: number
): Promise<{
  stories: StoryItemStory[];
  topics: Pick<Topic, "id" | "name">[];
  activeUserId: string;
  activeUserUsername: string;
  hasNextPage: boolean;
  storiesCount: number;
} | null> => {
  const [storiesRes, topicsRes, activeUserRes] = await Promise.all([
    fetchStoriesByTopicOnServer(topic, limit, page),
    fetchHomeTopicsOnServer(),
    fetchActiveUserOnServer(),
  ]);

  if (topicsRes.length === 0 || !activeUserRes || !activeUserRes.serviceUser)
    return null;

  return {
    ...storiesRes,
    topics: topicsRes,
    activeUserId: activeUserRes.serviceUser.id,
    activeUserUsername: activeUserRes.serviceUser.username,
  };
};

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { tag, page = "1" } = await searchParams;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);

  const limit = 5;
  const initialData = await fetchHomePageInitialData(tag, limit, currentPage);

  if (!initialData) {
    return null;
  }

  const {
    stories,
    activeUserId,
    topics,
    storiesCount,
    hasNextPage,
    activeUserUsername,
  } = initialData;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <TopicsCarousel activeTopic={tag} topics={topics} />
      <div style={{ minHeight: "calc(100vh - 260px)" }}>
        <HomeStoriesContainer
          stories={stories}
          activeUserId={activeUserId}
          activeUserUsername={activeUserUsername}
        />
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
    </main>
  );
};

export default HomePage;
