import { ExtendedReadingList } from "@/components/reading-list/ReadingListItem";
import UserReadingListsContainer from "@/components/story/containers/UserReadingListsContainer";
import { fetchUserDetailedReadingListsByIdOnServer } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
import {
  fetchActiveUserIdOnServer,
  fetchUserIdByUsernameOnServer,
} from "@/lib/component-fetches/service-user/fetchUserServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";

type SearchParams = {
  page?: string;
};

type PageParams = {
  username: string;
};

const fetchPageInitialData = async (
  username: string,
  limit: number,
  page: number
): Promise<{
  readingLists: ExtendedReadingList[];
  activeUserId: string;
  targetUserId: string;
  hasNextPage: boolean;
  readingListsCount: number;
} | null> => {
  const [activeUserId, targetUserId] = await Promise.all([
    fetchActiveUserIdOnServer(),
    fetchUserIdByUsernameOnServer(username),
  ]);
  if (!activeUserId || !targetUserId) {
    return null;
  }

  const readingListsRes = await fetchUserDetailedReadingListsByIdOnServer(
    targetUserId,
    limit,
    page
  );
  if (!readingListsRes) return null;

  return {
    ...readingListsRes,
    activeUserId,
    targetUserId,
  };
};

const UserListsPage = async ({
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

  if (!data) return null;

  console.log(data.readingLists);

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <UserReadingListsContainer
          username={username}
          limit={limit}
          currentPage={currentPage}
          {...data}
        />
      </div>
    </main>
  );
};

export default UserListsPage;
