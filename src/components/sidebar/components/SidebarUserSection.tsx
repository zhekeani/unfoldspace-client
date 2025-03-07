"use client";

import { updateUserFollowing } from "@/actions/user/updateUserFollowing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchUserByIdOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import { cn } from "@/lib/utils";
import { UserWFollowStatus } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Ellipsis, MailPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type SidebarUserSectionProps = {
  initialUser: UserWFollowStatus;
  isSameUser: boolean;
};

const InnerSidebarUserSection = ({
  initialUser,
  isSameUser,
}: SidebarUserSectionProps) => {
  const queryClient = useQueryClient();
  const {
    data: user,
    error: userError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user", initialUser.id],
    queryFn: () => fetchUserByIdOnClient(initialUser.id),
    initialData: initialUser,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: followMutation, isPending: isUpdateFollowing } = useMutation({
    mutationFn: async (actionType: "follow" | "unfollow") =>
      updateUserFollowing(user?.id || initialUser.id, actionType),

    onMutate: async (actionType) => {
      queryClient.setQueryData(
        ["user", initialUser.id],
        (oldData: UserWFollowStatus) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            has_followed: actionType === "unfollow",
          };
        }
      );
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      }
      queryClient.invalidateQueries({ queryKey: ["user", initialUser.id] });
    },
  });

  const onFollow = () => {
    const actionType = user!.has_followed ? "unfollow" : "follow";
    followMutation(actionType);
  };

  if (userError || !user) {
    return null;
  }

  const isDisabled = isSameUser || isUpdateFollowing || isLoading || isFetching;

  return (
    <div>
      <div className="flex justify-between w-full desktop:block">
        <div className="flex desktop:block gap-4">
          <Avatar className="w-12 h-12 desktop:w-[88px] desktop:h-[88px]">
            <AvatarImage
              className="w-full h-full object-cover"
              src={user.profile_picture || ""}
            />
            <AvatarFallback className="text-3xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="desktop:mt-3">
              <h4 className="font-medium text-2xl desktop:text-base">
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </h4>
            </div>

            <div className="mt-1 desktop:mt-2">
              <p className="font-normal  text-sub-text">
                {user.followers_count} Followers
              </p>
            </div>
          </div>

          {user.short_bio && (
            <div className="mt-3 hidden desktop:block">
              <p className="font-normal text-sm text-sub-text">
                {user.short_bio}
              </p>
            </div>
          )}
        </div>

        <div>
          {isSameUser && (
            <div className="desktop:mt-4">
              <Link
                role="button"
                href={"/"}
                className="text-xs text-green-700 hidden desktop:block"
              >
                Edit profile
              </Link>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="desktop:hidden group rounded-full"
              >
                <Ellipsis
                  strokeWidth={2}
                  className="fill-sub-text stroke-sub-text group-hover:stroke-main-text group-hover:fill-main-text"
                />
              </Button>
            </div>
          )}
          {!isSameUser && (
            <div className="desktop:mt-4 flex gap-2">
              <Button
                onClick={onFollow}
                disabled={isDisabled}
                variant={user.has_followed ? "secondary" : "default"}
                className={cn(
                  "hidden tablet:flex rounded-full transition-colors font-normal",
                  user.has_followed ? "" : "bg-main-green"
                )}
              >
                {user.has_followed ? "Unfollow" : "Follow"}
              </Button>
              <Button
                className="hidden tablet:flex rounded-full bg-main-green transition-colors"
                size={"icon"}
              >
                <MailPlus strokeWidth={1.5} />
              </Button>

              <Button
                size={"icon"}
                variant={"ghost"}
                className="desktop:hidden group rounded-full"
              >
                <Ellipsis
                  strokeWidth={2}
                  className="fill-sub-text stroke-sub-text group-hover:stroke-main-text group-hover:fill-main-text"
                />
              </Button>
            </div>
          )}
        </div>
      </div>

      {!isSameUser && (
        <div className="flex gap-3 mt-6 tablet:hidden">
          <Button
            onClick={onFollow}
            disabled={isDisabled}
            variant={user.has_followed ? "secondary" : "default"}
            className={cn(
              "flex-1 rounded-full transition-colors font-normal",
              user.has_followed ? "" : "bg-main-green"
            )}
          >
            {user.has_followed ? "Unfollow" : "Follow"}
          </Button>
          <Button
            className="rounded-full bg-main-green transition-colors"
            size={"icon"}
          >
            <MailPlus strokeWidth={1.5} />
          </Button>
        </div>
      )}
    </div>
  );
};

const SidebarUserSection = (props: SidebarUserSectionProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerSidebarUserSection {...props} />
    </QueryClientProvider>
  );
};

export default SidebarUserSection;
