import UserAboutContainer from "@/components/containers/UserAboutContainer";
import {
  fetchActiveUserIdOnServer,
  fetchUserByUsernameOnServer,
} from "@/lib/component-fetches/service-user/fetchUserServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";
import { UserWFollowStatus } from "@/types/database.types";
import { redirect } from "next/navigation";

type PageParams = {
  username: string;
};

const fetchPageInitialData = async (
  username: string
): Promise<{
  targetUser: UserWFollowStatus;
  activeUserId: string;
} | null> => {
  const [targetUser, activeUserId] = await Promise.all([
    fetchUserByUsernameOnServer(username),
    fetchActiveUserIdOnServer(),
  ]);

  if (!targetUser || !activeUserId) return null;

  return {
    targetUser,
    activeUserId,
  };
};

const UserAboutPage = async ({ params }: { params: Promise<PageParams> }) => {
  const { username: encodedUsername } = await params;
  const username = extractUsernameFromUrl(encodedUsername)!;

  const data = await fetchPageInitialData(username);
  if (!data) {
    redirect("/");
  }

  const { targetUser: user, activeUserId } = data;

  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6">
      <UserAboutContainer
        initialUser={user}
        activeUserId={activeUserId}
        username={username}
      />
    </main>
  );
};

export default UserAboutPage;
