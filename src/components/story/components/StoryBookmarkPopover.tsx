import { updateReadingListStory } from "@/actions/reading-list/updateReadingListStory";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchReadingListWSavedOnClient } from "@/lib/component-fetches/reading-list/fetchReadingListsClient";
import { ReadingListVisibility } from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkPlus, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StoryItemStory } from "../StoryItem";

export type StoryBookmarkPopoverReadingList = {
  id: string;
  title: string;
  is_saved: boolean;
  is_default: boolean;
  visibility: ReadingListVisibility;
};

type StoryBookmarkPopoverProps = {
  isStorySaved: boolean;
  activeUserId: string;
  storyId: string;
};

const StoryBookmarkPopover = ({
  isStorySaved,
  activeUserId,
  storyId,
}: StoryBookmarkPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: readingLists, error } = useQuery({
    queryKey: ["reading_lists", activeUserId],
    queryFn: () => fetchReadingListWSavedOnClient(storyId),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: saveMutation, isPending: isUpdatingReadingList } =
    useMutation({
      mutationFn: async ({
        readingListId,
        actionType,
      }: {
        readingListId: string;
        actionType: "save" | "unsave";
      }) => updateReadingListStory({ actionType, storyId, readingListId }),

      onMutate: async ({
        readingListId,
        actionType,
      }: {
        readingListId: string;
        actionType: "save" | "unsave";
      }) => {
        queryClient.setQueryData(
          ["reading_lists", activeUserId],
          (oldData: StoryBookmarkPopoverReadingList[]) => {
            if (!oldData) return oldData;
            return oldData.map((readingList) => {
              if (readingList.id === readingListId) {
                return {
                  ...readingList,
                  is_saved: actionType === "save",
                };
              } else {
                return readingList;
              }
            });
          }
        );

        const newIsSaved =
          actionType === "save" ||
          readingLists?.some((readingList) => readingList.is_saved);

        queryClient.setQueryData(
          ["story", storyId],
          (oldData: StoryItemStory) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              is_saved: newIsSaved,
            };
          }
        );
      },

      onSuccess: (res) => {
        if (!res.success) {
          toast.error(res.error);
        }
        queryClient.invalidateQueries({
          queryKey: ["reading_lists", activeUserId],
        });
        queryClient.invalidateQueries({
          queryKey: ["story", storyId],
        });
      },
    });

  useEffect(() => {
    if (error || !readingLists || readingLists.length === 0) {
      setIsOpen(false);
    }
  }, [error, readingLists]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          variant="ghost"
          className="h-full px-3 hidden tablet:block group"
        >
          {!isStorySaved && (
            <BookmarkPlus
              className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text"
              strokeWidth={1}
            />
          )}
          {isStorySaved && (
            <Bookmark
              className="!w-5 !h-5 stroke-sub-text fill-sub-text group-hover:stroke-main-text group-hover:fill-main-text"
              strokeWidth={1}
            />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        {readingLists && readingLists.length > 0 && (
          <div className="flex flex-col ">
            <div className="flex flex-col gap-5 py-6">
              {readingLists.map((readingList) => (
                <div
                  key={readingList.id}
                  className="flex items-center justify-between"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-4 items-center"
                  >
                    <Checkbox
                      disabled={isUpdatingReadingList}
                      checked={readingList.is_saved}
                      className="cursor-pointer"
                      onCheckedChange={() =>
                        saveMutation({
                          readingListId: readingList.id,
                          actionType: readingList.is_saved ? "unsave" : "save",
                        })
                      }
                    />
                    <p className="text-main-text text-sm">
                      {readingList.title}
                    </p>
                  </div>
                  {readingList.visibility === "private" && (
                    <Lock
                      className="stroke-main-text w-[14px] h-[14px]"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="border-t-[1px] border-t-complement-light-gray py-3 ">
              <Button
                onClick={() => {
                  //  e.stopPropagation();
                  //  e.preventDefault();
                  //  setIsDialogOpen((prev) => !prev);
                }}
                variant={"ghost"}
                className="hover:bg-transparent text-sm px-0 text-main-green"
              >
                Create a new list
              </Button>
              {/* <CreateReadingListDialog
                     isOpen={isDialogOpen}
                     setIsOpen={setIsDialogOpen}
                   >
                     <Button
                       onClick={(e) => {
                         e.stopPropagation();
                         e.preventDefault();
                         setIsDialogOpen((prev) => !prev);
                       }}
                       variant={"ghost"}
                       className="hover:bg-transparent text-sm px-0 text-main-green"
                     >
                       Create a new list
                     </Button>
                   </CreateReadingListDialog> */}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StoryBookmarkPopover;
