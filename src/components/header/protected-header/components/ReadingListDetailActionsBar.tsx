import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkPlus, Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { updateReadingListVisibility } from "../../../../actions/reading-list/updateReadingList";
import { updateSavedReadingLists } from "../../../../actions/reading-list/updateSavedReadingList";
import { cn } from "../../../../lib/utils";
import { ReadingListDetail } from "../../../../types/database.types";
import { useReadingListDetail } from "../../../context/ReadingListDetailContext";
import ReadingListActionsPopover from "../../../reading-list/popovers/ReadingListActionsPopover";
import { Button } from "../../../ui/button";
import ItemDetailActionButton from "./DetailActionsButtons";

type ReadingListDetailActionsBarProps = {
  activeUserId: string;
  readingList: ReadingListDetail;
  collapsible?: boolean;
};

const ReadingListDetailActionsBar = ({
  activeUserId,
  readingList: detailedReadingList,
  collapsible = true,
}: ReadingListDetailActionsBarProps) => {
  const { listDetailQueryKey, listItemsQueryKey } = useReadingListDetail();
  const queryClient = useQueryClient();

  const { mutate: updateVisibilityMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: (visibility: "private" | "public") =>
        updateReadingListVisibility(readingList.id, visibility),

      onMutate: (visibility: "private" | "public") => {
        queryClient.setQueryData(
          listDetailQueryKey,
          (oldData?: ReadingListDetail) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              visibility,
            };
          }
        );
      },

      onSuccess: (res) => {
        if (!res.success) {
          toast.error(res.error);
        } else {
          toast.success("Successfully updated list");
        }
        queryClient.invalidateQueries({ queryKey: listDetailQueryKey });
      },
    });

  const { mutate: saveMutation, isPending: isSavingList } = useMutation({
    mutationFn: (args: { listId: string; actionType: "save" | "unsave" }) =>
      updateSavedReadingLists(args.listId, args.actionType),

    onMutate: (args: { listId: string; actionType: "save" | "unsave" }) => {
      queryClient.setQueryData(
        listDetailQueryKey,
        (oldData?: ReadingListDetail) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            is_saved: args.actionType === "save",
          };
        }
      );
    },

    onSuccess: (res, { actionType }) => {
      if (!res.success) {
        console.error(res.error);
        toast.error(res.error);
      } else {
        toast.success(
          `Successfully ${actionType === "save" ? "saved" : "unsaved"} reading list`
        );
      }
      queryClient.invalidateQueries({ queryKey: listDetailQueryKey });
    },
  });

  const {
    has_clapped,
    has_responded,
    claps_count,
    responses_count,
    visibility,
    ...readingList
  } = detailedReadingList;

  const isOwned = readingList.user_id === activeUserId;

  return (
    <div className={cn("mb-5", collapsible && "tablet:mb-10")}>
      <div
        className={cn(
          " flex items-center justify-start  ",
          !collapsible &&
            "justify-between border-y-[1px] border-y-gray-200 py-1",
          collapsible &&
            "tablet:border-y-gray-200 tablet:py-1 tablet:justify-between tablet:border-y-[1px]"
        )}
      >
        <div
          className={cn(
            "hidden  gap-3",
            !collapsible && "flex",
            collapsible && "tablet:flex"
          )}
        >
          <ItemDetailActionButton.Clap
            onClap={() => {}}
            hasClapped={has_clapped}
            isClapping={false}
            clapCount={claps_count}
          />
          <ItemDetailActionButton.Respond
            onRespond={() => {}}
            hasResponded={has_responded}
            responseCount={responses_count}
          />
        </div>
        <div className="flex gap-1">
          {!isOwned && readingList.is_saved && (
            <Button
              disabled={isSavingList}
              role="button"
              variant="ghost"
              className="rounded-full group"
              size="icon"
              onClick={() =>
                saveMutation({ listId: readingList.id, actionType: "unsave" })
              }
            >
              <Bookmark
                strokeWidth={1.5}
                className="!w-5 !h-5 stroke-sub-text fill-sub-text group-hover:fill-text-main-text group-hover:stroke-main-text transition-colors"
              />
            </Button>
          )}
          {!isOwned && !readingList.is_saved && (
            <Button
              disabled={isSavingList}
              role="button"
              variant="ghost"
              className="rounded-full group"
              size="icon"
              onClick={() =>
                saveMutation({ listId: readingList.id, actionType: "save" })
              }
            >
              <BookmarkPlus
                strokeWidth={1.5}
                className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text transition-colors"
              />
            </Button>
          )}

          <ItemDetailActionButton.Share
            onShare={() => {}}
            collapsible={collapsible}
          />

          <ReadingListActionsPopover
            readingList={{
              ...readingList,
              claps_count: claps_count,
              visibility: visibility,
              responses_count: responses_count,
            }}
            listQueryKey={listDetailQueryKey}
            listsQueryKey={listItemsQueryKey}
            isOwned={readingList.user_id === activeUserId}
            isDefault={readingList.is_default}
            visibility={visibility}
            isUpdating={isUpdating}
            updateVisibilityMutation={updateVisibilityMutation}
          >
            <Button
              variant="ghost"
              className={cn(
                "flex gap-3 items-center  border-[1px]  rounded-full text-sub-text group transition-colors",
                !collapsible && "border-none p-3",
                collapsible && "tablet:border-none tablet:p-3"
              )}
            >
              <Ellipsis
                strokeWidth={1}
                className=" stroke-sub-text group-hover:stroke-main-text  !w-5 !h-5"
              />

              <p
                className={cn(
                  " text-sub-text font-normal",
                  !collapsible && "hidden",
                  collapsible && "tablet:hidden"
                )}
              >
                More
              </p>
            </Button>
          </ReadingListActionsPopover>
        </div>
      </div>
      {/* <div
        className={cn(
          "mt-10 h-[1px] w-full  bg-gray-200",
          !collapsible && "hidden",
          collapsible && "tablet:hidden"
        )}
      ></div> */}
    </div>
  );
};

export default ReadingListDetailActionsBar;
