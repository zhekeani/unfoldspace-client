"use client";

import { updateReadingListStory } from "@/actions/reading-list/updateReadingListStory";
import PulseSpinner from "@/components/loading/PulseSpinner";
import {
  PopoverButton,
  PopoverDivider,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
import ReadingListCreationDialog from "@/components/reading-list/dialogs/ReadingListCreationDialog";
import { StoryItemStory } from "@/components/story/StoryItem";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchActiveUserReadingListsByStoryId } from "@/lib/component-fetches/reading-list/fetchReadingListsClient";
import { ReadingList } from "@/types/database.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Key } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

export type StoryBookmarkReadingList = Pick<
  ReadingList,
  "id" | "title" | "is_default" | "visibility"
> & { is_saved: boolean };

type StoryBookmarkPopoverProps = {
  isStorySaved: boolean;
  storyId: string;
  activeUserId: string;
  children: ReactNode;
};

const StoryBookmarkPopover = ({
  storyId,
  children,
}: StoryBookmarkPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReadingLists, setCurrentReadingLists] = useState<
    StoryBookmarkReadingList[]
  >([]);

  const popoverQueryKey = ["bookmark_popover", storyId];

  const queryClient = useQueryClient();
  const {
    data,
    error: readingListsError,
    isLoading,
  } = useQuery({
    queryKey: popoverQueryKey,
    queryFn: () => fetchActiveUserReadingListsByStoryId(storyId),
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

      onMutate: async ({ readingListId, actionType }) => {
        queryClient.setQueryData(
          popoverQueryKey,
          (oldData?: { readingLists: StoryBookmarkReadingList[] }) => {
            if (!oldData || !oldData.readingLists) return oldData;

            const updatedLists = oldData.readingLists.map((readingList) => ({
              ...readingList,
              is_saved:
                readingList.id === readingListId
                  ? actionType === "save"
                  : readingList.is_saved,
            }));

            return { ...oldData, readingLists: updatedLists };
          }
        );

        queryClient.setQueryData(
          ["story", storyId],
          (oldData: StoryItemStory) => {
            if (!oldData) return oldData;

            const totalSaved = data?.readingLists?.filter(
              (r) => r.is_saved
            ).length;
            const isBecomingUnsaved =
              totalSaved === 1 && actionType === "unsave";

            return {
              ...oldData,
              is_saved: !isBecomingUnsaved,
            };
          }
        );
      },

      onSuccess: (res) => {
        if (!res.success) {
          toast.error(res.error);
        }
        queryClient.invalidateQueries({
          queryKey: popoverQueryKey,
        });
        queryClient.invalidateQueries({
          queryKey: ["story", storyId],
        });
      },
    });

  useEffect(() => {
    if (
      readingListsError ||
      !data ||
      !data.readingLists ||
      data.readingLists.length === 0
    ) {
      setIsOpen(false);
    }
  }, [data, readingListsError]);

  useEffect(() => {
    if (data && data.readingLists) {
      setCurrentReadingLists(data.readingLists);
    }
  }, [data, data?.readingLists]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent>
        {isLoading && (
          <div className="h-[160px] flex w-full justify-center items-center">
            <PulseSpinner size="small" />
          </div>
        )}
        {!isLoading && data && (
          <div className="w-[300px] flex flex-col items-start">
            <PopoverGroup className="w-full px-6 py-6">
              <div className="w-full flex flex-col gap-3">
                {currentReadingLists.map((readingList) => (
                  <div
                    key={readingList.id}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <Checkbox
                        disabled={isUpdatingReadingList}
                        checked={readingList.is_saved}
                        className="cursor-pointer disabled:cursor-none disabled:opacity-100 data-[state=checked]:bg-main-green rounded-none border-gray-200"
                        onCheckedChange={() =>
                          saveMutation({
                            readingListId: readingList.id,
                            actionType: readingList.is_saved
                              ? "unsave"
                              : "save",
                          })
                        }
                      />
                      <p className="text-main-text text-base">
                        {readingList.title}
                      </p>
                    </div>
                    {readingList.visibility === "private" && (
                      <Key
                        className="stroke-main-text w-[14px] h-[14px]"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                ))}
              </div>
            </PopoverGroup>
            <PopoverDivider />

            <PopoverGroup className="px-3 py-4">
              <ReadingListCreationDialog
                readingListsQueryKey={popoverQueryKey}
                actionType="create"
                readingListType="preview"
              >
                <PopoverButton variant="success" className="text-base">
                  Create a new list
                </PopoverButton>
              </ReadingListCreationDialog>
            </PopoverGroup>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StoryBookmarkPopover;
