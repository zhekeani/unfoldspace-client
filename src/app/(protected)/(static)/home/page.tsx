import TopicsCarousel from "@/components/carousel/TopicCarousel";
import GeneralPagination from "@/components/pagination/GeneralPagination";
import HomeStoriesContainer from "@/components/story/containers/HomeStoriesContainer";
import { StoryItemStory } from "@/components/story/StoryItem";
import { fetchStoriesByTopicOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { fetchHomeTopicsOnServer } from "@/lib/component-fetches/topic/fetchTopicsServer";
import { Topic } from "@/types/database.types";

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
  hasNextPage: boolean;
  storiesCount: number;
} | null> => {
  const [storiesRes, topicsRes] = await Promise.all([
    fetchStoriesByTopicOnServer(topic, limit, page),
    fetchHomeTopicsOnServer(),
  ]);

  if (topicsRes.length === 0 || !storiesRes.activeUserId) return null;

  return {
    ...storiesRes,
    topics: topicsRes,
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

  const { stories, activeUserId, topics, storiesCount, hasNextPage } =
    initialData;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <TopicsCarousel activeTopic={tag} topics={topics} />
      <div style={{ minHeight: "calc(100vh - 260px)" }}>
        <HomeStoriesContainer stories={stories} activeUserId={activeUserId} />
      </div>
      {storiesCount > 0 && (
        <div className="my-6">
          <GeneralPagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            storiesCount={storiesCount}
          />
        </div>
      )}
    </main>
  );
};

export default HomePage;
