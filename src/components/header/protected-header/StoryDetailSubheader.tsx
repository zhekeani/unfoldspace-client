import { updateUserFollowing } from "@/actions/user/updateUserFollowing";
import { useStoryDetail } from "@/components/context/StoryDetailContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import calculateReadTime from "@/lib/story/calculateReadTime";
import convertIsoDate from "@/lib/story/convertIsoDate";
import { cn } from "@/lib/utils";
import { StoryDetail, UserWFollowStatus } from "@/types/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type StoryDetailSubheaderProps = {
  isOwned: boolean;
  story: StoryDetail;
  user: UserWFollowStatus;
};

const StoryDetailSubheader = ({
  story,
  isOwned,
  user,
}: StoryDetailSubheaderProps) => {
  const queryClient = useQueryClient();
  const { userQueryKey } = useStoryDetail();

  const { mutate: followMutation, isPending: isUpdateFollowing } = useMutation({
    mutationFn: async (actionType: "follow" | "unfollow") =>
      updateUserFollowing(user.id, actionType),

    onMutate: async (actionType) => {
      queryClient.setQueryData(userQueryKey, (oldData: UserWFollowStatus) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          has_followed: actionType === "unfollow",
        };
      });
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      }
      queryClient.invalidateQueries({ queryKey: userQueryKey });
    },
  });

  const onFollow = () => {
    const actionType = user.has_followed ? "unfollow" : "follow";
    followMutation(actionType);
  };

  return (
    <div>
      <h1
        className={cn(
          "mt-8 tablet:mt-[50px] text-main-text text-3xl tablet:text-5xl font-medium tracking-tight",
          !story.description && "tablet:mb-8  mb-6"
        )}
      >
        {story.title}
      </h1>
      {story.description && (
        <p className="mt-3 mb-6 text-xl tracking-normal text-sub-text">
          {story.description}
        </p>
      )}
      <div className="flex">
        <Link href={`/${story.author_username}`}>
          <Avatar className="w-[42px] h-[42px]">
            <AvatarImage
              className="w-full h-full object-cover"
              src={story.author_profile_picture || ""}
            />
            <AvatarFallback>
              {story.author_username!.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col ml-3">
          <div className="flex items-center">
            <Link
              href={`/${story.author_username}`}
              className="text-main-text text-base tracking-tight leading-5 hover:underline"
            >
              {story.author_name}
            </Link>
            {!isOwned && (
              <div className="flex items-center">
                <Dot
                  size={20}
                  strokeWidth={1}
                  className="fill-sub-text stroke-sub-text "
                />
                <Button
                  disabled={isUpdateFollowing}
                  onClick={onFollow}
                  variant="ghost"
                  size="sm"
                  className="w-fit px-0 !h-5"
                >
                  <p className="text-base font-normal text-main-text underline">
                    {user.has_followed ? "Unfollow" : "Follow"}
                  </p>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center text-sub-text">
            <p className="text-sm">{calculateReadTime(story.words_count)}</p>
            <Dot strokeWidth={1} className="fill-sub-text stroke-sub-text" />
            <p className="text-sm">{convertIsoDate(story.published_at!)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailSubheader;
