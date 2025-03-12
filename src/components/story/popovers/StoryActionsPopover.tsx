import {
  PopoverButton,
  PopoverDivider,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
import StoryDeletionAlertDialog from "@/components/story/dialogs/StoryDeletionAlertDialog";
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
import Link from "next/link";
import { ReactNode, useState } from "react";

type StoryActionsPopoverProps = {
  storyId: string;
  isOwned: boolean;
  storyUserId: string;
  storyUserUsername: string;
  activeUserId: string;
  children: ReactNode;
  deleteMutation: () => void;
  isDeleting: boolean;
};

const StoryActionsPopover = ({
  children,
  isOwned,
  deleteMutation,
  isDeleting,
  storyId,
}: StoryActionsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
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
              <PopoverButton
                asChild
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Link href={`/editor?storyId=${storyId}`}>Edit story</Link>
              </PopoverButton>
            </PopoverGroup>
            <PopoverDivider />
            <PopoverGroup>
              <PopoverButton>Story settings</PopoverButton>
              <PopoverButton>Story stats</PopoverButton>
            </PopoverGroup>
            <PopoverDivider />
            <PopoverGroup>
              <PopoverButton>Hide responses</PopoverButton>
              <StoryDeletionAlertDialog
                isDeleting={isDeleting}
                handleDelete={deleteMutation}
              >
                <PopoverButton variant="danger">Delete story</PopoverButton>
              </StoryDeletionAlertDialog>
            </PopoverGroup>
          </div>
        )}

        {!isOwned && (
          <div>
            <PopoverGroup>
              <PopoverButton>Copy link</PopoverButton>
            </PopoverGroup>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default StoryActionsPopover;
