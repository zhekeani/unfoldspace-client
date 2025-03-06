"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchUserPreviewByIdOnClient } from "@/lib/component-fetches/service-user/fetchUserClient";
import { ServiceUser } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { updateUserFollowing } from "../../actions/user/updateUserFollowing";
import UserPopoverSkeleton from "./components/UserPopoverSkeleton";

type UserPopoverProps = {
  userId: string;
  activeUserId: string;
  children: ReactNode;
};

export type UserPopoverServiceUser = ServiceUser & { has_followed: boolean };

const InnerUserPopover = ({
  userId,
  activeUserId,
  children,
}: UserPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch, isRefetching, isFetching } =
    useQuery({
      queryKey: ["user-popover", userId],
      queryFn: () => fetchUserPreviewByIdOnClient(userId),
      enabled: false, // Initially disabled, fetch only when opened
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { mutate: followMutation, isPending: isUpdateFollowing } = useMutation({
    mutationFn: async (actionType: "follow" | "unfollow") =>
      updateUserFollowing(userId, actionType),

    onMutate: async (actionType) => {
      queryClient.setQueryData(
        ["user-popover", userId],
        (oldData: UserPopoverServiceUser) => {
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
      queryClient.invalidateQueries({ queryKey: ["user-popover", userId] });
      refetch();
    },
  });

  const onFollow = () => {
    const actionType = data?.user.has_followed ? "unfollow" : "follow";
    followMutation(actionType);
  };

  useEffect(() => {
    if (isOpen) {
      refetch(); // Trigger fetch only when popover opens
    }
  }, [isOpen, refetch]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const isSameUser = userId === activeUserId;
  const isDisabled =
    isSameUser || isUpdateFollowing || isLoading || isFetching || isRefetching;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </PopoverTrigger>

      <PopoverContent
        className="!py-6 !px-5"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading ? (
          <UserPopoverSkeleton />
        ) : error || !data || !data.user ? null : (
          <>
            <div className="flex justify-between items-end">
              <Link href={`%40${data.user.username}`} className="rounded-full">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    className="w-full h-full object-cover"
                    src={data.user.profile_picture || ""}
                  />
                  <AvatarFallback>
                    {data.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                onClick={onFollow}
                disabled={isDisabled}
                variant={data.user.has_followed ? "secondary" : "default"}
                size="sm"
                className="rounded-full font-normal"
              >
                {data.user.has_followed ? "Unfollow" : "Follow"}
              </Button>
            </div>
            <div className="mt-3">
              <Link
                href={`%40${data.user.username}`}
                className="text-main-text font-medium"
              >
                {data.user.name}
              </Link>
              <p className="text-xs-sm text-main-text mt-1.5 font-light">
                {data.user.followers_count}{" "}
                <span className="text-sub-text">Followers</span>
              </p>
            </div>

            <div className="mt-3">
              <p className="font-light text-xs-sm text-black">
                {data.user.short_bio}
              </p>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

const UserPopover = (props: UserPopoverProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <InnerUserPopover {...props} />
    </QueryClientProvider>
  );
};

export default UserPopover;
