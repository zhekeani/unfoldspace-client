import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/story/calculateReadTime";
import { Story } from "@/types/database.types";
import Link from "next/link";
import UserPopover from "../../popover/UserPopover";

type SidebarStoryItemProps = {
  story: Story;
};

const SidebarStoryItem = ({ story }: SidebarStoryItemProps) => {
  return (
    <div>
      <div className="flex gap-2 items-center mb-3">
        <UserPopover userId={story.user_id}>
          <Link href={`/%40${story.author_username}`} className="">
            <Avatar className="w-6 h-6">
              <AvatarImage
                className="w-full h-full object-cover"
                src={story.author_profile_picture || ""}
              />
              <AvatarFallback>
                {story.author_username!.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </UserPopover>
        <div className=" text-xs text-black tracking-tight flex gap-1">
          <p className=" text-sub-text font-light">by</p>{" "}
          <UserPopover userId={story.user_id}>
            <Link
              href={`/%40${story.author_username}`}
              className="font-normal hover:underline"
            >
              {story.author_name}
            </Link>
          </UserPopover>
        </div>
      </div>

      <Link href={`/%40${story.author_username}/${story.id}`}>
        <h3 className=" font-medium tracking-tight leading-5 mb-3 line-clamp-2 text-main-text">
          {story.title}
        </h3>
        <p className="text-xs text-sub-text font-light">
          {timeAgo(story.published_at!)}
        </p>
      </Link>
    </div>
  );
};

export default SidebarStoryItem;
