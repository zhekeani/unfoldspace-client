import StoryDetailContainer from "@/components/containers/StoryDetailContainer";
import {
  fetchActiveUserOnServer,
  fetchUserByUsernameOnServer,
} from "@/lib/component-fetches/service-user/fetchUserServer";
import {
  fetchStoryDetailByIdOnServer,
  fetchTopicsByStoryOnServer,
} from "@/lib/component-fetches/story/fetchStoryServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";
import {
  ServiceUser,
  StoryDetail,
  Topic,
  UserWFollowStatus,
} from "@/types/database.types";

type PageParams = {
  username: string;
  storyId: string;
};

const fetchPageInitialData = async (
  storyId: string,
  username: string
): Promise<{
  story: StoryDetail;
  topics: Topic[];
  user: UserWFollowStatus;
  activeUser: ServiceUser;
} | null> => {
  const [storyDetailRes, topicsRes, userRes, activeUserRes] = await Promise.all(
    [
      fetchStoryDetailByIdOnServer(storyId),
      fetchTopicsByStoryOnServer(storyId),
      fetchUserByUsernameOnServer(username),
      fetchActiveUserOnServer(),
    ]
  );
  if (!storyDetailRes || !topicsRes || !userRes || !activeUserRes) {
    return null;
  }

  return {
    story: storyDetailRes,
    topics: topicsRes.topics,
    user: userRes,
    activeUser: activeUserRes.serviceUser,
  };
};

const StoryDetailPage = async ({ params }: { params: Promise<PageParams> }) => {
  const { username: encodedUsername, storyId } = await params;
  const username = extractUsernameFromUrl(encodedUsername)!;

  const data = await fetchPageInitialData(storyId, username);

  if (!data) return null;

  return <StoryDetailContainer {...data} />;
};

export default StoryDetailPage;
