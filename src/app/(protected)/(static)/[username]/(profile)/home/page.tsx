import GeneralPagination from "@/components/pagination/GeneralPagination";
import UserStoriesContainer from "@/components/story/containers/UserStoriesContainer";
import { StoryItemStory } from "@/components/story/StoryItem";
import { fetchActiveUserIdOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { fetchUserStoriesOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
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
} | null> => {
  const [storiesRes, activeUserIdRes] = await Promise.all([
    fetchUserStoriesOnServer(username, limit, page),
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

  const { stories, storiesCount, hasNextPage, activeUserId } = data;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 260px)" }}>
        <UserStoriesContainer stories={stories} activeUserId={activeUserId} />
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

export default UserHomePage;
