import UserStoriesContainer from "@/components/containers/UserStoriesContainer";
import { StoryItemStory } from "@/components/story/StoryItem";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { fetchUserStoriesWInteractionsOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";
import { redirect } from "next/navigation";

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
  activeUserUsername: string;
  hasNextPage: boolean;
  storiesCount: number;
  targetUserId: string;
} | null> => {
  const [storiesRes, activeUserRes] = await Promise.all([
    fetchUserStoriesWInteractionsOnServer(username, limit, page),
    fetchActiveUserOnServer(),
  ]);

  if (!activeUserRes || !activeUserRes.serviceUser) return null;

  return {
    ...storiesRes,
    activeUserId: activeUserRes.serviceUser.id,
    activeUserUsername: activeUserRes.serviceUser.username,
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
    redirect("/");
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
