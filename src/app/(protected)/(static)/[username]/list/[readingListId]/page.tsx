import ReadingListDetailContainer from "../../../../../../components/containers/ReadingListDetailContainer";
import { ExtendedReadingListItem } from "../../../../../../components/reading-list/ReadingListStoryItem";
import { fetchListItemsByListIdOnServer } from "../../../../../../lib/component-fetches/reading-list-item/fetchReadingListItemsServer";
import { fetchReadingListDetailByIdOnServer } from "../../../../../../lib/component-fetches/reading-list/fetchReadingListsServer";
import { fetchActiveUserIdOnServer } from "../../../../../../lib/component-fetches/service-user/fetchUserServer";
import { extractUsernameFromUrl } from "../../../../../../lib/components/subsection-tab/extractUsername";
import { ReadingListDetail } from "../../../../../../types/database.types";

type PageParams = {
  username: string;
  readingListId: string;
};

type SearchParams = {
  page?: string;
  actionType?: "remove" | "reorder";
};

const fetchPageInitialData = async (
  listId: string,
  limit: number,
  page: number
): Promise<{
  listItems: ExtendedReadingListItem[];
  readingList: ReadingListDetail;
  hasNextPage: boolean;
  activeUserId: string;
  listItemsCount: number;
} | null> => {
  const [activeUserId, listDetailRes, listItemsRes] = await Promise.all([
    fetchActiveUserIdOnServer(),
    fetchReadingListDetailByIdOnServer(listId),
    fetchListItemsByListIdOnServer(listId, limit, page),
  ]);
  if (!activeUserId || !listDetailRes || !listItemsRes) {
    return null;
  }

  return {
    activeUserId,
    readingList: listDetailRes.readingList,
    ...listItemsRes,
  };
};

const ReadingListDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) => {
  const { readingListId, username: encodedUsername } = await params;

  const { page = "1" } = await searchParams;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const username = extractUsernameFromUrl(encodedUsername)!;

  const limit = 8;
  const data = await fetchPageInitialData(readingListId, limit, currentPage);

  if (!data) return null;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <ReadingListDetailContainer
          username={username}
          limit={limit}
          currentPage={currentPage}
          {...data}
        />
      </div>
    </main>
  );
};

export default ReadingListDetailPage;
