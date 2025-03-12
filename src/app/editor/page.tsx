import StoryEditorContainer from "@/components/containers/StoryEditorContainer";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { fetchStoryByIdOnServer } from "@/lib/component-fetches/story/fetchStoriesServer";
import { fetchAllTopicsOnServer } from "@/lib/component-fetches/topic/fetchTopicsServer";
import { Story } from "@/types/database.types";
import { redirect } from "next/navigation";

type SearchParams = {
  storyId?: string;
};

const fetchPageInitialData = async (
  storyId: string
): Promise<{ story: Story; storyId: string } | null> => {
  const response = await fetchStoryByIdOnServer(storyId);

  if (!response) {
    return null;
  }

  return { story: response, storyId: storyId };
};

const StoryEditorPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { storyId } = await searchParams;

  let data: { story: Story; storyId: string } | null = null;
  if (storyId) {
    data = await fetchPageInitialData(storyId);

    if (!data) {
      redirect("/home");
    }
  }

  const [activeUserRes, topicsRes] = await Promise.all([
    fetchActiveUserOnServer(),
    fetchAllTopicsOnServer(),
  ]);
  if (!activeUserRes || !topicsRes) return null;

  return (
    <StoryEditorContainer
      topics={topicsRes.topics}
      pageData={data}
      activeUser={activeUserRes.serviceUser}
    />
  );
};

export default StoryEditorPage;
