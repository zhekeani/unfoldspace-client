import TopicsCarousel from "@/components/carousel/TopicCarousel";
import HomeStoriesContainer from "@/components/containers/HomeStoriesContainer";
import { StoryItemStory } from "@/components/story/StoryItem";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { fetchStoriesByTopicOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { fetchHomeTopicsOnServer } from "@/lib/component-fetches/topic/fetchTopicsServer";
import { Topic } from "@/types/database.types";
import { redirect } from "next/navigation";

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
    redirect("/");
  }

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <TopicsCarousel activeTopic={tag} topics={initialData.topics} />
      <div>
        <HomeStoriesContainer
          topic={tag}
          limit={limit}
          currentPage={currentPage}
          {...initialData}
        />
      </div>
    </main>
  );
};

export default HomePage;
