import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  BookmarkPlus,
  Heart,
  MessageCircle,
  Share,
} from "lucide-react";

type ClapActionButtonProps = {
  onClap: () => void;
  isClapping: boolean;
  hasClapped: boolean;
  clapCount: number;
};

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const ClapActionButton = ({
  onClap,
  isClapping,
  hasClapped,
  clapCount,
}: ClapActionButtonProps) => {
  return (
    <div className="flex">
      <Button
        onClick={onClap}
        disabled={isClapping}
        variant="ghost"
        size="icon"
        className={cn("rounded-full group transition-colors")}
      >
        <Heart
          strokeWidth={1.5}
          className={cn(
            " stroke-sub-text group-hover:stroke-main-text !w-5 !h-5",
            hasClapped && "fill-sub-text"
          )}
        />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full flex text-xs font-normal text-sub-text w-fit  px-[1px] hover:bg-transparent"
      >
        {" "}
        {formatNumber(clapCount)}
      </Button>
    </div>
  );
};

type RespondActionButtonProps = {
  onRespond: () => void;
  hasResponded: boolean;
  responseCount: number;
};
const RespondActionButton = ({
  onRespond,
  hasResponded,
  responseCount,
}: RespondActionButtonProps) => {
  return (
    <div className="flex">
      <Button
        onClick={onRespond}
        variant="ghost"
        size="icon"
        className={cn("rounded-full group transition-colors")}
      >
        <MessageCircle
          strokeWidth={1.5}
          className={cn(
            " stroke-sub-text group-hover:stroke-main-text !w-5 !h-5",
            hasResponded && "fill-sub-text"
          )}
        />
      </Button>
      <Button
        variant="ghost"
        className="rounded-full flex text-xs font-normal text-sub-text w-fit  px-[1px] hover:bg-transparent"
      >
        {formatNumber(responseCount)}
      </Button>
    </div>
  );
};

type BookmarkActionButton = {
  onBookmark: () => void;
  collapsible: boolean;
  isBookmarked: boolean;
};
const BookmarkActionButton = ({
  onBookmark,
  collapsible,
  isBookmarked,
}: BookmarkActionButton) => {
  return (
    <Button
      onClick={onBookmark}
      variant="ghost"
      className={cn(
        " gap-3 items-center hidden p-3 border-none rounded-xl w-fit",
        !collapsible && "flex",
        collapsible && "tablet:flex"
      )}
    >
      {isBookmarked && (
        <Bookmark
          strokeWidth={1.5}
          className=" stroke-sub-text fill-sub-text !w-5 !h-5"
        />
      )}
      {!isBookmarked && (
        <BookmarkPlus
          strokeWidth={1.5}
          className=" stroke-sub-text !w-5 !h-5"
        />
      )}
    </Button>
  );
};

type ShareActionButtonProps = {
  onShare: () => void;
  collapsible: boolean;
};
const ShareActionButton = ({
  onShare,
  collapsible,
}: ShareActionButtonProps) => {
  return (
    <Button
      onClick={onShare}
      variant="ghost"
      className={cn(
        "flex gap-3 items-center  rounded-xl border-[1px] group  text-sub-text",
        !collapsible && "border-none p-3",
        collapsible && "tablet:border-none tablet:p-3"
      )}
    >
      <Share
        strokeWidth={1.5}
        className=" stroke-sub-text group-hover:text-main-text !w-5 !h-5 "
      />
      <p
        className={cn(
          " font-normal",
          !collapsible && "hidden",
          collapsible && "tablet:hidden"
        )}
      >
        Share
      </p>
    </Button>
  );
};

const ItemDetailActionButton = {
  Clap: ClapActionButton,
  Respond: RespondActionButton,
  Bookmark: BookmarkActionButton,
  Share: ShareActionButton,
};

export default ItemDetailActionButton;
