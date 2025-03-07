import HomeStoriesContainer from "../../../../components/story/containers/HomeStoriesContainer";
import { StoryItemStory } from "../../../../components/story/StoryItem";
import { fetchStoriesByTopicOnServer } from "../../../../lib/component-fetches/story/fetchStoriesServer";
import { fetchHomeTopicsOnServer } from "../../../../lib/component-fetches/topic/fetchTopicsServer";
import { Topic } from "../../../../types/database.types";

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

  const { stories, activeUserId } = initialData;

  return (
    <main className="w-full pt-2 desktop:pt-6 flex flex-col">
      <HomeStoriesContainer stories={stories} activeUserId={activeUserId} />
    </main>
  );
};

export default HomePage;
