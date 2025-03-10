import { Ellipsis } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { ReadingListDetail } from "../../../../types/database.types";
import { Button } from "../../../ui/button";
import ItemDetailActionButton from "./DetailActionsButtons";

type ReadingListDetailActionsBarProps = {
  listDetailQueryKey: string[];
  activeUserId: string;
  readingList: ReadingListDetail;
  collapsible?: boolean;
};

const ReadingListDetailActionsBar = ({
  listDetailQueryKey,
  activeUserId,
  readingList,
  collapsible = true,
}: ReadingListDetailActionsBarProps) => {
  const {
    has_clapped,
    has_responded,
    claps_count,
    responses_count,
    visibility,
  } = readingList;
  const isPrivate = visibility === "private";

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
            isPrivate={isPrivate}
          />
          <ItemDetailActionButton.Respond
            onRespond={() => {}}
            hasResponded={has_responded}
            responseCount={responses_count}
            isPrivate={isPrivate}
          />
        </div>
        <div className="flex gap-1">
          {/* <StoryBookmarkPopover
            initialIsSaved={story.is_saved}
            storyId={story.id}
          /> */}

          {/* <ItemDetailActionButton.Bookmark
            onBookmark={onBookmark}
            collapsible={collapsible}
            isBookmarked={story.is_saved}
          /> */}

          <ItemDetailActionButton.Share
            onShare={() => {}}
            collapsible={collapsible}
          />

          <Button
            variant="ghost"
            className={cn(
              "flex gap-3 items-center  border-[1px]  rounded-full text-sub-text",
              !collapsible && "border-none p-3",
              collapsible && "tablet:border-none tablet:p-3"
            )}
          >
            <Ellipsis strokeWidth={1} className=" stroke-sub-text  !w-5 !h-5" />

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
