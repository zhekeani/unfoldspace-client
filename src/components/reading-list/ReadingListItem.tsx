import { deleteReadingList } from "@/actions/reading-list/deleteReadingList";
import { updateReadingListVisibility } from "@/actions/reading-list/updateReadingList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchReadingListDetailOnClient } from "@/lib/component-fetches/reading-list/fetchReadingListsClient";
import { Database } from "@/types/supabase.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkPlus, Ellipsis, Key } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { toast } from "sonner";
import ReadingListActionsPopover from "./popovers/ReadingListActionsPopover";

export type ExtendedReadingList =
  Database["public"]["Functions"]["get_user_reading_lists_by_id"]["Returns"][number];

type CoverImageItemProps = HTMLAttributes<HTMLDivElement> & {
  coverImageUrl?: string;
  index: number;
};

const CoverImageItem = ({ coverImageUrl, index }: CoverImageItemProps) => {
  return (
    <div className="relative bg-muted-foreground/10  w-full h-full outline-none border-none">
      {coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImageUrl || undefined}
          alt="reading list item"
          className="object-cover h-full w-full"
        />
      )}
      {index !== 2 && (
        <div className="absolute h-full w-[3px] right-0 bg-white outline-none border-none" />
      )}
    </div>
  );
};

type ReadingListItemProps = {
  isOwned: boolean;
  initialReadingList: ExtendedReadingList;
  username: string;
  readingListsQueryKey: string[];
};

const ReadingListItem = ({
  initialReadingList,
  isOwned,
  username,
  readingListsQueryKey,
}: ReadingListItemProps) => {
  const queryClient = useQueryClient();

  const queryKey = ["reading_list", initialReadingList.id];
  const { data: readingList, error: readingListError } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchReadingListDetailOnClient(initialReadingList.id),
    initialData: initialReadingList,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: updateVisibilityMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (visibility: "private" | "public") =>
        updateReadingListVisibility(initialReadingList.id, visibility),

      onMutate: (visibility: "private" | "public") => {
        queryClient.setQueryData(queryKey, (oldData?: ExtendedReadingList) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            visibility,
          };
        });
      },

      onSuccess: (res) => {
        if (!res.success) {
          toast.error(res.error);
        } else {
          toast.success("Successfully updated list");
        }
        queryClient.invalidateQueries({ queryKey: queryKey });
      },
    });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteReadingList(initialReadingList.id),

    onMutate: () => {
      queryClient.setQueryData(
        readingListsQueryKey,
        (oldData?: { readingLists: ExtendedReadingList[] }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            readingLists: oldData.readingLists.filter(
              (readingList) => readingList.id !== initialReadingList.id
            ),
          };
        }
      );
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully deleted list");
      }
      queryClient.invalidateQueries({ queryKey: readingListsQueryKey });
    },
  });

  if (readingListError || !readingList) {
    return null;
  }

  const recentCoversUrls = Array.isArray(readingList.recent_story_covers)
    ? (readingList.recent_story_covers as unknown as string[])
    : [];

  return (
    <div className="w-[294px] mobile:w-full h-[288px] mobile:h-[144px] border-[1px] border-accent/70 flex flex-col mobile:flex-row bg-accent/50 overflow-hidden rounded-sm">
      {/* User info */}
      <div className="flex-1 px-6 pt-6 pb-[10px]">
        <Link href={`/%40${username}/lists/${readingList.id}`}>
          <div className="flex gap-2 items-center">
            <Avatar className="w-6 h-6">
              <AvatarImage
                className="w-full h-full object-cover"
                src={readingList.owner_profile_picture || undefined}
              />
              <AvatarFallback className="text-xs rounded-full bg-gray-200">
                {readingList.owner_username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <p className="text-sm">{readingList.owner_name}</p>
          </div>

          <h4 className="mt-3 text-xl font-medium line-clamp-1">
            {readingList.title}
          </h4>
        </Link>
        <div className="h-10 flex  items-center">
          <Link
            href={`/%40${username}/lists/${readingList.id}`}
            className="flex flex-1 items-center gap-2"
          >
            <p className="text-sm text-sub-text">
              {readingList.stories_count === 0
                ? "No"
                : readingList.stories_count}{" "}
              stories
            </p>
            {readingList.visibility === "private" && (
              <Key
                size={14}
                strokeWidth={1.5}
                // fill="currentColor"
                className="stroke-sub-text"
              />
            )}
          </Link>

          <div className="flex items-center ">
            {!isOwned && readingList.is_saved && (
              <Button
                role="button"
                variant="ghost"
                className="rounded-full group"
                size="icon"
              >
                <Bookmark
                  strokeWidth={1.5}
                  className="!w-5 !h-5 stroke-sub-text fill-sub-text group-hover:fill-text-main-text group-hover:stroke-main-text transition-colors"
                />
              </Button>
            )}
            {!isOwned && !readingList.is_saved && (
              <Button
                role="button"
                variant="ghost"
                className="rounded-full group"
                size="icon"
              >
                <BookmarkPlus
                  strokeWidth={1.5}
                  className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text transition-colors"
                />
              </Button>
            )}
            <ReadingListActionsPopover
              isOwned={isOwned}
              isDefault={readingList.is_default}
              visibility={readingList.visibility}
              isDeleting={isDeleting}
              isUpdating={isUpdating}
              deleteMutation={deleteMutation}
              updateVisibilityMutation={updateVisibilityMutation}
            >
              <Button
                role="button"
                variant="ghost"
                className="rounded-full group"
                size="icon"
              >
                <Ellipsis
                  strokeWidth={2}
                  className="stroke-sub-text group-hover:stroke-main-text transition-colors"
                />
              </Button>
            </ReadingListActionsPopover>
          </div>
        </div>
      </div>

      {/* Stories' cover images */}
      <Link
        href={`/%40${username}/lists/${readingList.id}`}
        className="flex-1 mobile:flex-none w-[294px] grid grid-cols-[50%_30%_20%]"
      >
        {recentCoversUrls.map((storyCover, index) => (
          <CoverImageItem
            index={index}
            key={index}
            coverImageUrl={storyCover}
            className=""
          />
        ))}

        {Array.from({ length: 3 - recentCoversUrls.length }).map((_, index) => (
          <CoverImageItem key={index} index={recentCoversUrls.length + index} />
        ))}
      </Link>
    </div>
  );
};

export default ReadingListItem;
