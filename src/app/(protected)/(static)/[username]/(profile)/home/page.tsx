import UserStoriesContainer from "@/components/story/containers/UserStoriesContainer";
import { StoryItemStory } from "@/components/story/StoryItem";
import { fetchActiveUserIdOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { fetchUserStoriesWInteractionsOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";

type PageParams = {
  username: string;
};

type SearchParams = {
  page?: string;
};

const fetchPageInitialData = async (
  username: string,
  limit: number,
  page: number
): Promise<{
  stories: StoryItemStory[];
  activeUserId: string;
  hasNextPage: boolean;
  storiesCount: number;
  targetUserId: string;
} | null> => {
  const [storiesRes, activeUserIdRes] = await Promise.all([
    fetchUserStoriesWInteractionsOnServer(username, limit, page),
    fetchActiveUserIdOnServer(),
  ]);

  if (!activeUserIdRes) return null;

  return {
    ...storiesRes,
    activeUserId: activeUserIdRes,
  };
};

const UserHomePage = async ({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) => {
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);

  const { username: encodedUsername } = await params;
  const username = extractUsernameFromUrl(encodedUsername)!;

  const limit = 8;
  const data = await fetchPageInitialData(username, limit, currentPage);

  if (!data) {
    return null;
  }

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 260px)" }}>
        <UserStoriesContainer
          limit={limit}
          currentPage={currentPage}
          {...data}
        />
      </div>
    </main>
  );
};

export default UserHomePage;
