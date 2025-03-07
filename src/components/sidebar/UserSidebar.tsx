import { fetchUserReadingListsById } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
import { UserWFollowStatus } from "@/types/database.types";
import Link from "next/link";
import SidebarFooter from "./components/SidebarFooter";
import SidebarReadingListItem from "./components/SidebarReadingListItem";
import SideBarSubsectionWrapper from "./components/SidebarSubsectionWrapper";
import SidebarUserSection from "./components/SidebarUserSection";

type UserSidebarProps = {
  user: UserWFollowStatus;
  activeUserId: string;
};

const fetchSidebarData = async (userId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const [readingLists] = await Promise.all([fetchUserReadingListsById(userId)]);

  return {
    readingLists: readingLists,
  };
};

const UserSidebar = async ({ user, activeUserId }: UserSidebarProps) => {
  const data = await fetchSidebarData(user.id);

  const { readingLists } = data;
  const isSameUser = activeUserId === user.id;

  return (
    <div className="w-full desktop:w-[303px] flex desktop:flex-col justify-between;">
      <div className="mt-10 w-full desktop:w-fit">
        <SidebarUserSection initialUser={user} isSameUser={isSameUser} />

        {readingLists && (
          <div className="hidden desktop:block">
            <SideBarSubsectionWrapper heading="Lists">
              <div className="flex flex-col gap-4 mb-4">
                {readingLists.map((readingList) => (
                  <SidebarReadingListItem
                    key={readingList.id}
                    readingList={readingList}
                  />
                ))}
              </div>

              <Link
                href={"/"}
                className="text-sub-text text-sm hover:underline"
              >
                View all
              </Link>
            </SideBarSubsectionWrapper>
          </div>
        )}
      </div>

      <div className="hidden desktop:block">
        <SidebarFooter />
      </div>
    </div>
  );
};

export default UserSidebar;
