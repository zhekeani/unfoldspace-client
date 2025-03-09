import {
  PopoverButton,
  PopoverDivider,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
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
import { ReactNode } from "react";

type StoryActionsPopoverProps = {
  storyId: string;
  isOwned: boolean;
  storyUserId: string;
  storyUserUsername: string;
  activeUserId: string;
  children: ReactNode;

  deleteStoryCb?: (storyId: string) => void;
};

const StoryActionsPopover = ({
  children,
  isOwned,
}: StoryActionsPopoverProps) => {
  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>More</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="">
        {isOwned && (
          <div className="flex flex-col items-start">
            <PopoverGroup>
              <PopoverButton>Edit story</PopoverButton>
            </PopoverGroup>
            <PopoverDivider />
            <PopoverGroup>
              <PopoverButton>Story settings</PopoverButton>
              <PopoverButton>Story stats</PopoverButton>
            </PopoverGroup>
            <PopoverDivider />
            <PopoverGroup>
              <PopoverButton>Hide responses</PopoverButton>
              <PopoverButton variant="danger">Delete story</PopoverButton>
            </PopoverGroup>
          </div>
        )}

        {!isOwned && (
          <div>
            <PopoverGroup>
              <PopoverButton>Follow author</PopoverButton>
            </PopoverGroup>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StoryActionsPopover;
