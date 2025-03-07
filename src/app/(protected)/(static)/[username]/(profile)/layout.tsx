import UserSubheader from "@/components/header/protected-header/UserSubheader";
import UserSidebarSkeleton from "@/components/sidebar/skeletons/UserSidebarSkeleton";
import UserSidebar from "@/components/sidebar/UserSidebar";
import {
  fetchActiveUserIdOnServer,
  fetchUserByUsernameOnServer,
  fetchUserIdByUsernameOnServer,
} from "@/lib/component-fetches/service-user/fetchUserServer";
import { extractUsernameFromUrl } from "@/lib/components/subsection-tab/extractUsername";
import { generateUserSubsectionTabs } from "@/lib/components/subsection-tab/generateTabs";
import { cn } from "@/lib/utils";
import { UserWFollowStatus } from "@/types/database.types";
import { ReactNode, Suspense } from "react";

type PageParams = {
  username: string;
};

const fetchUserData = async (
  username: string
): Promise<{ targetUser: UserWFollowStatus; activeUserId: string } | null> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const userId = await fetchUserIdByUsernameOnServer(username);
  if (!userId) return null;

  const [serviceUser, activeUserId] = await Promise.all([
    fetchUserByUsernameOnServer(username),
    fetchActiveUserIdOnServer(),
  ]);
  if (!serviceUser || !activeUserId) return null;

  return {
    targetUser: serviceUser,
    activeUserId: activeUserId,
  };
};

const UserLayout = async ({
  params,
  children,
}: {
  params: Promise<PageParams>;
  children: ReactNode;
}) => {
  const { username: encodedUsername } = await params;
  const username = extractUsernameFromUrl(encodedUsername)!;

  const userData = await fetchUserData(username);
  if (!userData) {
    return null;
  }

  const { targetUser, activeUserId } = userData;
  const subsectionTabs = generateUserSubsectionTabs(username);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { has_followed, ...user } = targetUser;

  return (
    <div className="w-full flex-1 max-w-[1336px] mx-auto flex desktop:flex-row justify-evenly items-center desktop:items-start flex-col-reverse">
      <div className="left-content w-full">
        <UserSubheader
          user={user}
          activeUserId={activeUserId}
          subsectionTabs={subsectionTabs}
        />
        {children}
      </div>
      <div
        className={cn(
          "desktop:flex desktop:w-[351px] desktop:min-w-[351px] desktop:min-h-full h-fit desktop:pr-6 desktop:justify-end desktop:border-l-[1px] desktop:border-l-black/10 desktop:flex-none desktop:pl-0",
          "flex-1 max-w-[728px] w-full h-fit px-6"
        )}
      >
        <Suspense fallback={<UserSidebarSkeleton />}>
          <UserSidebar user={targetUser} activeUserId={activeUserId} />
        </Suspense>
      </div>
    </div>
  );
};

export default UserLayout;
