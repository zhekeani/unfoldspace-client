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
import { MailPlus } from "lucide-react";
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
    <>
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
          <p className="font-normal text-sm text-sub-text">{user.short_bio}</p>
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
          <Button
            onClick={onFollow}
            disabled={isDisabled}
            variant={user.has_followed ? "secondary" : "default"}
            className={cn(
              "rounded-full  transition-colors font-normal",
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
    </>
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
