import GeneralPagination from "@/components/pagination/GeneralPagination";
import { ExtendedReadingList } from "@/components/reading-list/ReadingListItem";
import UserReadingListsContainer from "@/components/story/containers/UserReadingListsContainer";
import { fetchUserDetailedReadingListsById } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
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

  const readingListsRes = await fetchUserDetailedReadingListsById(
    targetUserId,
    limit,
    page
  );
  if (!readingListsRes) return null;

  return {
    ...readingListsRes,
    activeUserId,
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

  const { readingLists, readingListsCount, hasNextPage, activeUserId } = data;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <UserReadingListsContainer
          readingLists={readingLists}
          activeUserId={activeUserId}
          username={username}
        />
      </div>
      {readingListsCount > 0 && (
        <div className="my-6">
          <GeneralPagination
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            storiesCount={readingListsCount}
          />
        </div>
      )}
    </main>
  );
};

export default UserListsPage;
