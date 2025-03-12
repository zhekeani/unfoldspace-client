import { updateUserFollowing } from "@/actions/user/updateUserFollowing";
import { useStoryDetail } from "@/components/context/StoryDetailContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserWFollowStatus } from "@/types/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

type StoryDetailAuthorInfoProps = {
  user: UserWFollowStatus;
  isOwned: boolean;
};

const StoryDetailAuthorInfo = ({
  user,
  isOwned,
}: StoryDetailAuthorInfoProps) => {
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
    <div className="w-full flex flex-col mt-12 tablet:flex-row">
      <div className="mb-5 flex justify-between tablet:pr-5 items-end tablet:items-start">
        <Link href="">
          <Avatar className="w-16 h-16 tablet:w-12 tablet:h-12 ">
            <AvatarImage
              className="w-full h-full object-cover"
              src={user.profile_picture || ""}
            />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        {!isOwned && (
          <Button
            disabled={isUpdateFollowing}
            onClick={onFollow}
            className="tablet:hidden rounded-full font-normal"
          >
            {user.has_followed ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <div className="tablet:flex-1 ">
        <div className="tablet:max-w-[500px]">
          <Link
            href={""}
            className="text-2xl tablet:text-xl font-medium text-main-text  leading-none"
          >
            Written by {user.name}
          </Link>

          <div className="flex mt-2 text-sub-text text-sm">
            <Link href={""}>
              {formatNumber(user.followers_count || 0)} Followers
            </Link>{" "}
            <Dot strokeWidth={1} className="" />{" "}
            <Link href={""}>
              {formatNumber(user.following_count || 0)} Following`
            </Link>
          </div>

          {user.short_bio && (
            <div className="mt-4">
              <p className="text-main-text text-sm">{user.short_bio}</p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden tablet:block">
        <Button className=" rounded-full font-normal">Follow</Button>
      </div>
      <div></div>
    </div>
  );
};

export default StoryDetailAuthorInfo;
