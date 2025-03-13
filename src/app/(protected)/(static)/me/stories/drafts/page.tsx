import MeDraftsContainer from "@/components/containers/MeDraftsContainer";
import { StoryDraft } from "@/components/story/StoryDraftItem";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { fetchActiveUserDraftsOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { redirect } from "next/navigation";

type SearchParams = {
  page?: string;
};

const fetchPageInitialData = async (
  limit: number,
  page: number
): Promise<{
  drafts: StoryDraft[];
  hasNextPage: boolean;
  draftsCount: number;
  activeUserId: string;
  activeUserUsername: string;
} | null> => {
  const activeUserRes = await fetchActiveUserOnServer();
  if (!activeUserRes || !activeUserRes.serviceUser) return null;
  const activeUser = activeUserRes.serviceUser;

  const draftsRes = await fetchActiveUserDraftsOnServer(
    activeUser.id,
    limit,
    page
  );

  if (!draftsRes) return null;

  return {
    ...draftsRes,
    activeUserId: activeUser.id,
    activeUserUsername: activeUser.username,
  };
};

const MeStoriesDraftsPage = async ({
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
    <main className="w-full min-h-fit pt-2 desktop:pt-2 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <MeDraftsContainer limit={limit} currentPage={currentPage} {...data} />
      </div>
    </main>
  );
};

export default MeStoriesDraftsPage;
