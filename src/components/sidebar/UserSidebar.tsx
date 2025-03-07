import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchUserReadingListsById } from "@/lib/component-fetches/reading-list/fetchReadingListsServer";
import {
  fetchActiveUserIdOnServer,
  fetchUserByUsernameOnServer,
  fetchUserIdByUsernameOnServer,
} from "@/lib/component-fetches/service-user/fetchUserServer";
import { MailPlus } from "lucide-react";
import Link from "next/link";
import SidebarFooter from "./components/SidebarFooter";
import SidebarReadingListItem from "./components/SidebarReadingListItem";
import SideBarSubsectionWrapper from "./components/SidebarSubsectionWrapper";

type UserSidebarProps = {
  username: string;
};

const fetchSidebarData = async (username: string) => {
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
        <Avatar className="w-[88px] h-[88px]">
          <AvatarImage
            className="w-full h-full object-cover"
            src={user.profile_picture || ""}
          />
          <AvatarFallback className="text-3xl">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="mt-3">
          <h4 className="font-medium">
            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
          </h4>
        </div>

        <div className="mt-2">
          <p className="font-normal  text-sub-text">
            {user.followers_count} Followers
          </p>
        </div>

        {user.short_bio && (
          <div className="mt-3">
            <p className="font-normal text-sm text-sub-text">
              {user.short_bio}
            </p>
          </div>
        )}

        {isSameUser && (
          <div className="mt-4">
            <Link role="button" href={"/"} className="text-xs text-green-700">
              Edit profile
            </Link>
          </div>
        )}
        {!isSameUser && (
          <div className="mt-4 flex gap-2">
            <Button className="rounded-full bg-main-green transition-colors font-normal">
              Follow
            </Button>
            <Button
              className="rounded-full bg-main-green transition-colors"
              size={"icon"}
            >
              <MailPlus strokeWidth={1.5} />
            </Button>
          </div>
        )}

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
