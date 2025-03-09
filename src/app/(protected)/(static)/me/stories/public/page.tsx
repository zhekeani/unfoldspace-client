import MePublishedStoriesContainer from "../../../../../../components/story/containers/MePublishedStoriesContainer";
import { fetchActiveUserOnServer } from "../../../../../../lib/component-fetches/service-user/fetchUserServer";
import { fetchUserStoriesByIdOnServer } from "../../../../../../lib/component-fetches/story/fetchStoriesServer";
import { Story } from "../../../../../../types/database.types";

type SearchParams = {
  page?: string;
};

const fetchPageInitialData = async (
  limit: number,
  page: number
): Promise<{
  stories: Story[];
  hasNextPage: boolean;
  storiesCount: number;
  activeUserId: string;
  activeUserUsername: string;
} | null> => {
  const activeUserRes = await fetchActiveUserOnServer();
  if (!activeUserRes || !activeUserRes.serviceUser) return null;
  const activeUser = activeUserRes.serviceUser;

  const readingListsRes = await fetchUserStoriesByIdOnServer(
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

const MePublishedPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const limit = 8;

  const data = await fetchPageInitialData(limit, currentPage);

  if (!data) return null;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <MePublishedStoriesContainer
          limit={limit}
          currentPage={currentPage}
          {...data}
        />
      </div>
    </main>
  );
};

export default MePublishedPage;
