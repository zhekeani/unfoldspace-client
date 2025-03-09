"use client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Dot } from "lucide-react";
import { useState } from "react";
import { fetchUserByUsernameOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import convertIsoDate from "@/lib/story/convertIsoDate";
import { UserWFollowStatus } from "@/types/database.types";
import { Button } from "@/components/ui/button";

type UserAboutPageContainerProps = {
  initialUser: UserWFollowStatus;
  activeUserId: string;
  username: string;
};

const InnerUserAboutContainer = ({
  initialUser,
  activeUserId,
  username,
}: UserAboutPageContainerProps) => {
  const { data: user, error: userError } = useQuery({
    queryKey: ["user", initialUser.id],
    queryFn: () => fetchUserByUsernameOnClient(username),
    initialData: initialUser,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (userError || !user) return null;

  const isSameUser = activeUserId === user.id;
  const hasBio = !!user.bio;

  return (
    <div className="w-full px-6">
      {isSameUser && (
        <>
          {!hasBio && (
            <div className="pb-[48px] mb-[18px] border-b-complement-light-gray border-b-[1px] w-full">
              <div className="w-full px-8 py-[72px] flex flex-col items-center bg-gray-100">
                <h4 className="pb-5 text-center font-medium">
                  Tell the world about yourself
                </h4>
                <p className="pb-5 text-center mx-5 text-xs-sm tracking-tight font-light">
                  Here&apos;s where you can share more about yourself: your
                  history, word experience, accomplishments, interests, dreams,
                  and more. You can even add images and use rich text to
                  personalize you bio.
                </p>
                <Button
                  className="rounded-full text-sm font-normal border-black"
                  variant="outline"
                >
                  Get started
                </Button>
              </div>
            </div>
          )}
          {hasBio && <div></div>}
        </>
      )}
      {!isSameUser && (
        <>
          {hasBio && <div></div>}
          <div className="text-sm font-light flex gap-1.5">
            <p>UnfoldSpace member since </p>
            <p>{convertIsoDate(user.created_at)}</p>
          </div>
        </>
      )}
      <div className="mt-4 pb-6 flex items-center">
        <Button
          variant="ghost"
          className="text-main-green text-sm font-normal bg-transparent hover:bg-transparent hover:text-green-900 !px-0"
        >
          <p>{user.followers_count} Followers</p>
        </Button>
        <Dot className="fill-main-green stroke-main-green" strokeWidth={1} />
        <Button
          variant="ghost"
          className="text-main-green text-sm font-normal bg-transparent hover:bg-transparent hover:text-green-900 !px-0"
        >
          <p>{user.following_count} Following</p>
        </Button>
      </div>
    </div>
  );
};

const UserAboutContainer = (props: UserAboutPageContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerUserAboutContainer {...props} />
    </QueryClientProvider>
  );
};

export default UserAboutContainer;
