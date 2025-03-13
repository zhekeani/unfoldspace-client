import MeSavedReadingListsContainer from "@/components/containers/MeSavedReadingListsContainer";
import { ExtendedReadingList } from "@/components/reading-list/ReadingListItem";
import { fetchActiveUserSavedReadingListsOnServer } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
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

  const readingListsRes = await fetchActiveUserSavedReadingListsOnServer(
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

const MeListsSavedPage = async ({
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
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <MeSavedReadingListsContainer
          limit={limit}
          currentPage={currentPage}
          {...data}
        />
      </div>
    </main>
  );
};

export default MeListsSavedPage;
