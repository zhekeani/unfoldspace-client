import MeReadingListsContainer from "@/components/containers/MeReadingListsContainer";
import { ExtendedReadingList } from "@/components/reading-list/ReadingListItem";
import { fetchUserDetailedReadingListsByIdOnServer } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { redirect } from "next/navigation";

type SearchParams = {
  page?: string;
};

const fetchPageInitialData = async (
  limit: number,
  page: number
): Promise<{
  readingLists: ExtendedReadingList[];
  hasNextPage: boolean;
  readingListsCount: number;
  activeUserId: string;
  activeUserUsername: string;
} | null> => {
  const activeUserRes = await fetchActiveUserOnServer();
  if (!activeUserRes || !activeUserRes.serviceUser) return null;
  const activeUser = activeUserRes.serviceUser;

  const readingListsRes = await fetchUserDetailedReadingListsByIdOnServer(
    activeUser.id,
    limit,
    page
  );

  if (!readingListsRes) return null;

  return {
    ...readingListsRes,
    activeUserId: activeUser.id,
    activeUserUsername: activeUser.username,
  };
};

const MeListsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const limit = 8;

  const data = await fetchPageInitialData(limit, currentPage);

  if (!data) {
    redirect("/");
  }

  return (
    <MeReadingListsContainer
      limit={limit}
      currentPage={currentPage}
      {...data}
    />
  );
};

export default MeListsPage;
