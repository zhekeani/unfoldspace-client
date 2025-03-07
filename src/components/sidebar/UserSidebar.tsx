import { fetchUserReadingListsById } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
import {
  fetchActiveUserIdOnServer,
  fetchUserByUsernameOnServer,
  fetchUserIdByUsernameOnServer,
} from "@/lib/component-fetches/service-user/fetchUserServer";
import Link from "next/link";
import SidebarFooter from "./components/SidebarFooter";
import SidebarReadingListItem from "./components/SidebarReadingListItem";
import SideBarSubsectionWrapper from "./components/SidebarSubsectionWrapper";
import SidebarUserSection from "./components/SidebarUserSection";

type UserSidebarProps = {
  username: string;
};

const fetchSidebarData = async (username: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const userId = await fetchUserIdByUsernameOnServer(username);
  if (!userId) return null;

  const [serviceUser, activeUserId, readingLists] = await Promise.all([
    fetchUserByUsernameOnServer(username),
    fetchActiveUserIdOnServer(),
    fetchUserReadingListsById(userId),
  ]);
  if (!serviceUser || !activeUserId) return null;

  return {
    targetUser: serviceUser,
    activeUserId: activeUserId,
    readingLists: readingLists,
  };
};

const UserSidebar = async ({ username }: UserSidebarProps) => {
  const data = await fetchSidebarData(username);

  if (!data) {
    return null;
  }

  const { targetUser: user, activeUserId, readingLists } = data;

  const isSameUser = activeUserId === user.id;

  return (
    <div className="w-[303px] flex flex-col justify-between;">
      <div className="mt-10">
        <SidebarUserSection initialUser={user} isSameUser={isSameUser} />

        {readingLists && (
          <SideBarSubsectionWrapper heading="Lists">
            <div className="flex flex-col gap-4 mb-4">
              {readingLists.map((readingList) => (
                <SidebarReadingListItem
                  key={readingList.id}
                  readingList={readingList}
                />
              ))}
            </div>

            <Link href={"/"} className="text-sub-text text-sm hover:underline">
              View all
            </Link>
          </SideBarSubsectionWrapper>
        )}
      </div>

      <SidebarFooter />
    </div>
  );
};

export default UserSidebar;
