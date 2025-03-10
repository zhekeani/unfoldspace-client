"use client";

import { deletePublishedStory } from "@/actions/story/deleteStory";
import UserPopover from "@/components/popover/UserPopover";
import StoryActionsPopover from "@/components/story/popovers/StoryActionsPopover";
import StoryBookmarkPopover from "@/components/story/popovers/StoryBookmarkPopover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchStoryWInteractionsByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { timeAgo } from "@/lib/story/calculateReadTime";
import { Story } from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkPlus,
  Ellipsis,
  Heart,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExtendedReadingListItem } from "../reading-list/ReadingListStoryItem";

export type StoryItemStory = Story & { is_saved: boolean };

type BaseProps = {
  initialStory: StoryItemStory;
  isOwned: boolean;
  activeUserId: string;
  showProfile?: boolean;
};

type StoryItemTypeProps = BaseProps & {
  itemType?: "story";
  storiesQueryKey: string[];
  listId?: string;
  listItemId?: string;
  listItemsQueryKey?: string[];
  listDetailQueryKey?: string[];
};

type ListItemTypeProps = BaseProps & {
  itemType?: "list-item";
  storiesQueryKey?: string[];
  listId: string;
  listItemId: string;
  listItemsQueryKey: string[];
  listDetailQueryKey: string[];
};

type StoryItemProps = StoryItemTypeProps | ListItemTypeProps;

const StoryItem = ({
  initialStory,
  activeUserId,
  showProfile = true,
  storiesQueryKey,
  listId,
  listItemId,
  listItemsQueryKey,
  listDetailQueryKey,
  itemType = "story",
}: StoryItemProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [rowWidth, setRowWidth] = useState<number>(0);
  const queryClient = useQueryClient();

  const storyQueryKey = ["story", initialStory.id];
  const { data: story, error: storyError } = useQuery({
    queryKey: storyQueryKey,
    queryFn: () => fetchStoryWInteractionsByIdOnClient(initialStory.id),
    initialData: initialStory,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePublishedStory(initialStory.id),
    onMutate: () => {
      if (itemType === "story") {
        queryClient.setQueryData(
          storiesQueryKey!,
          (oldData?: { stories: StoryItemStory[] }) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              stories: oldData.stories.filter(
                (story) => story.id !== initialStory.id
              ),
            };
          }
        );
      }

      if (itemType === "list-item") {
        queryClient.setQueryData(
          listItemsQueryKey!,
          (oldData?: { listItems: ExtendedReadingListItem[] }) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              listItems: oldData.listItems.filter(
                (listItem) => listItem.reading_list_id !== listId
              ),
            };
          }
        );
      }
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully deleted story");
      }
      if (itemType === "story") {
        queryClient.invalidateQueries({ queryKey: storiesQueryKey });
      }

      if (itemType === "list-item") {
        queryClient.invalidateQueries({ queryKey: listItemsQueryKey });
        queryClient.invalidateQueries({ queryKey: listDetailQueryKey });
      }
    },
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
              <h2 className="text-xl tablet:text-2xl font-medium tracking-tight text-main-text line-clamp-3">
                {story.title}
              </h2>
              <p className="pt-2 text-sub-text tracking-tight line-clamp-2">
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
                  storyId={story.id}
                  storyQueryKey={storyQueryKey}
                  activeUserId={activeUserId}
                  isStorySaved={story.is_saved}
                  itemType={itemType as "story"}
                  listId={listId}
                  listItemId={listItemId}
                  listItemsQueryKey={listItemsQueryKey}
                  listDetailQueryKey={listDetailQueryKey}
                >
                  <Button
                    variant="ghost"
                    className="h-full px-3 hidden tablet:block group"
                  >
                    {!story.is_saved && (
                      <BookmarkPlus
                        className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text"
                        strokeWidth={1}
                      />
                    )}
                    {story.is_saved && (
                      <Bookmark
                        className="!w-5 !h-5 stroke-sub-text fill-sub-text group-hover:stroke-main-text group-hover:fill-main-text"
                        strokeWidth={1}
                      />
                    )}
                  </Button>
                </StoryBookmarkPopover>
              )}

              <StoryActionsPopover
                storyId={story.id}
                isOwned={story.user_id === activeUserId}
                storyUserId={story.user_id}
                storyUserUsername={story.author_username!}
                activeUserId={activeUserId}
                deleteMutation={deleteMutation}
                isDeleting={isDeleting}
              >
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  className="h-full px-2 group"
                >
                  <Ellipsis
                    className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text group-hover:fill-main-text"
                    strokeWidth={1.5}
                  />
                </Button>
              </StoryActionsPopover>
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
