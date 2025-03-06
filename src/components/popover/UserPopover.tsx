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
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import UserPopoverSkeleton from "./components/UserPopoverSkeleton";

type UserPopoverProps = {
  userId: string;
  children: ReactNode;
};

export type UserPopoverServiceUser = ServiceUser & { has_followed: boolean };

const InnerUserPopover = ({ userId, children }: UserPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["user-popover", userId],
    queryFn: () => fetchUserPreviewByIdOnClient(userId),
    enabled: false, // Initially disabled, fetch only when opened
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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
              <Link href={`%40${data.user.username}`}>
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
