import ReadingListDetailContainer from "@/components/containers/ReadingListDetailContainer";
import { ListDetailActionType } from "@/components/context/ReadingListDetailContext";
import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { fetchListItemsByListIdOnServer } from "@/lib/component-fetches/reading-list-item/fetchReadingListItemsServer";
import { fetchReadingListDetailByIdOnServer } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";
import { ReadingListDetail, ServiceUser } from "@/types/database.types";
import { redirect } from "next/navigation";

type PageParams = {
  username: string;
  readingListId: string;
};

type SearchParams = {
  page?: string;
  actionType?: ListDetailActionType;
};

const fetchPageInitialData = async (
  listId: string,
  limit: number,
  page: number
): Promise<{
  listItems: ExtendedReadingListItem[];
  readingList: ReadingListDetail;
  hasNextPage: boolean;
  activeUser: ServiceUser;
  listItemsCount: number;
} | null> => {
  const [activeUserRes, listDetailRes, listItemsRes] = await Promise.all([
    fetchActiveUserOnServer(),
    fetchReadingListDetailByIdOnServer(listId),
    fetchListItemsByListIdOnServer(listId, limit, page),
  ]);
  if (!activeUserRes || !listDetailRes || !listItemsRes) {
    return null;
  }

  return {
    activeUser: activeUserRes.serviceUser,
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

  const { page = "1", actionType } = await searchParams;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const username = extractUsernameFromUrl(encodedUsername)!;

  const limit = 8;
  const data = await fetchPageInitialData(readingListId, limit, currentPage);

  if (!data) {
    redirect("/");
  }

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <ReadingListDetailContainer
          username={username}
          limit={limit}
          currentPage={currentPage}
          pageActionType={actionType || null}
          {...data}
        />
      </div>
    </main>
  );
};

export default ReadingListDetailPage;
