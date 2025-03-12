import { deletePublishedStory } from "@/actions/story/deleteStory";
import { updateStoryClap } from "@/actions/story/updateStoryClap";
import { useStoryDetail } from "@/components/context/StoryDetailContext";
import StoryActionsPopover from "@/components/story/popovers/StoryActionsPopover";
import StoryBookmarkPopover from "@/components/story/popovers/StoryBookmarkPopover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StoryDetail } from "@/types/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkPlus, Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ItemDetailActionButton from "./DetailActionsButtons";

type StoryDetailActionsBarProps = {
  activeUserId: string;
  story: StoryDetail;
  collapsible?: boolean;
};

const StoryDetailActionsBar = ({
  collapsible = true,
  story,
  activeUserId,
}: StoryDetailActionsBarProps) => {
  const router = useRouter();
  const { storyDetailQueryKey } = useStoryDetail();
  const queryClient = useQueryClient();

  const { mutate: updateClapMutation, isPending: isClapping } = useMutation({
    mutationFn: (actionType: "remove" | "add") =>
      updateStoryClap(story.id, actionType),

    onMutate: (actionType: "remove" | "add") => {
      queryClient.setQueryData(
        storyDetailQueryKey,
        (oldData?: { story: StoryDetail }) => {
          if (!oldData || !oldData.story) return oldData;

          const tempList = oldData.story;

          return {
            story: {
              ...oldData.story,
              has_clapped: actionType === "add",
              claps_count:
                actionType === "add"
                  ? tempList.claps_count + 1
                  : tempList.claps_count - 1,
            },
          };
        }
      );
    },

    onSuccess: (res, actionType) => {
      if (!res.success) {
        console.error(res.error);
        toast.error(res.error);
      } else {
        toast.success(
          `Successfully ${actionType === "add" ? "added" : "removed"} story clap`
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: storyDetailQueryKey });
    },
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePublishedStory(story.id),

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully deleted story");
        router.push(`/%40${story.author_username}/home`);
      }
    },
  });

  const { has_clapped, claps_count, has_responded, responses_count } = story;

  return (
    <div className={cn("mb-5 mt-6", collapsible && "tablet:mb-10")}>
      <div
        className={cn(
          " flex items-center justify-start  ",
          !collapsible && "justify-between py-1 ",
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
            onClap={() => {
              updateClapMutation(has_clapped ? "remove" : "add");
            }}
            hasClapped={has_clapped}
            isClapping={isClapping}
            clapCount={claps_count}
          />
          <ItemDetailActionButton.Respond
            onRespond={() => {}}
            hasResponded={has_responded}
            responseCount={responses_count}
          />
        </div>
        <div className="flex gap-1">
          <StoryBookmarkPopover
            storyId={story.id}
            storyQueryKey={storyDetailQueryKey}
            activeUserId={activeUserId}
            isStorySaved={story.is_saved}
          >
            <Button
              role="button"
              variant="ghost"
              className="rounded-full group"
              size="icon"
            >
              {story.is_saved && (
                <Bookmark
                  strokeWidth={1.5}
                  className="!w-5 !h-5 stroke-sub-text fill-sub-text group-hover:fill-text-main-text group-hover:stroke-main-text transition-colors"
                />
              )}
              {!story.is_saved && (
                <BookmarkPlus
                  strokeWidth={1.5}
                  className="!w-5 !h-5 stroke-sub-text group-hover:stroke-main-text transition-colors"
                />
              )}
            </Button>
          </StoryBookmarkPopover>

          <ItemDetailActionButton.Share
            onShare={() => {}}
            collapsible={collapsible}
          />

          <StoryActionsPopover
            storyId={story.id}
            isOwned={story.user_id === activeUserId}
            storyUserId={story.user_id}
            storyUserUsername={story.author_username}
            activeUserId={activeUserId}
            deleteMutation={deleteMutation}
            isDeleting={isDeleting}
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
          </StoryActionsPopover>
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

export default StoryDetailActionsBar;
