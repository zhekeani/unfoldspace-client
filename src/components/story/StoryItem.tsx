"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchStoryByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { timeAgo } from "@/lib/story/calculateReadTime";
import { Story } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UserPopover from "../popover/UserPopover";
import StoryBookmarkPopover from "./components/StoryBookmarkPopover";

export type StoryItemStory = Story & { is_saved: boolean };

type StoryItemProps = {
  initialStory: StoryItemStory;
  isOwned: boolean;
  activeUserId: string;
  showProfile?: boolean;
};

const StoryItem = ({
  initialStory,
  activeUserId,
  showProfile = true,
}: StoryItemProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [rowWidth, setRowWidth] = useState<number>(0);

  const { data: story, error: storyError } = useQuery({
    queryKey: ["story", initialStory.id],
    queryFn: () => fetchStoryByIdOnClient(initialStory.id),
    initialData: initialStory,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!rowRef.current) return;

    const observer = new ResizeObserver(() => {
      if (rowRef.current) {
        setRowWidth(rowRef.current.clientWidth);
      }
    });

    observer.observe(rowRef.current);

    return () => observer.disconnect();
  }, []);

  const hideBookmark = rowWidth < 320;
  const hideCounts = rowWidth < 260;

  if (storyError || !story) {
    return null;
  }

  return (
    <div className=" h-fit flex flex-col mx-6 border-b-[1px] border-muted-gray-200">
      {/* Profile */}
      {showProfile && (
        <div className="flex gap-2 mb-4 items-center">
          <UserPopover userId={story.user_id} activeUserId={activeUserId}>
            <Link
              href={`/%40${story.author_username}`}
              className="rounded-full"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage
                  className="w-full h-full object-cover"
                  src={story.author_profile_picture || ""}
                />
                <AvatarFallback>
                  {story.author_name!.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </UserPopover>
          <div className="text-xs text-main-text tracking-tight flex gap-1">
            <span className="text-sub-text font-light">by</span>
            <UserPopover userId={story.user_id} activeUserId={activeUserId}>
              <Link
                href={`/%40${story.author_username}`}
                className="hover:underline text-main-text"
              >
                {story.author_name!}
              </Link>
            </UserPopover>
          </div>
        </div>
      )}

      <div className="flex flex-row">
        <div className="flex-1">
          <Link
            href={`/%40${story.author_username}/${story.id}`}
            className="flex"
          >
            <div>
              <h2 className="text-xl tablet:text-2xl font-medium tracking-tight text-main-text">
                {story.title}
              </h2>
              <p className="pt-2 text-sub-text tracking-tight">
                {story.description}
              </p>
            </div>
            <div className="flex-shrink-0 tablet:hidden">
              <img
                src={story.cover_image!}
                alt={story.title}
                width={80}
                height={53}
                className="ml-6"
              />
            </div>
          </Link>

          {/* Responsive Row */}
          <div ref={rowRef} className="h-[58px] flex  items-center pt-[10px]">
            <Link
              href={`/%40${story.author_username}/${story.id}`}
              className="flex flex-1 gap-5 text-xs text-sub-text"
            >
              <p>{timeAgo(story.published_at!)}</p>

              {!hideCounts && (
                <div className="flex gap-5 items-center">
                  <div className="flex gap-1 items-center text-sub-text">
                    <Heart
                      size={16}
                      strokeWidth={0}
                      fill="currentColor"
                      className="fill-sub-text stroke-transparent"
                    />
                    {story.claps_count}
                  </div>
                  <div className="flex gap-1 items-center text-sub-text">
                    <MessageCircle
                      size={16}
                      strokeWidth={0}
                      fill="currentColor"
                      className="fill-sub-text stroke-transparent"
                    />
                    {story.responses_count}
                  </div>
                </div>
              )}
            </Link>

            {/* User actions */}
            <div className="flex h-full">
              {!hideBookmark && (
                <StoryBookmarkPopover
                  isStorySaved={story.is_saved}
                  storyId={story.id}
                  activeUserId={activeUserId}
                />
              )}

              <Button
                onClick={(e) => e.stopPropagation()}
                variant="ghost"
                className="h-full px-2 group"
              >
                <Ellipsis
                  className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text group-hover:fill-main-text"
                  strokeWidth={1}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Image */}
        <Link
          href={`/%40${story.author_username}/${story.id}`}
          className="hidden tablet:block"
        >
          <Image
            src={story.cover_image!}
            alt={story.title}
            width={160}
            height={107}
            className="ml-14"
          />
        </Link>
      </div>
      <div className="w-full mt-5" />
    </div>
  );
};

export default StoryItem;
