import {
  PopoverButton,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
import ReadingListDeletionAlertDialog from "@/components/reading-list/dialogs/ReadingListDeletionAlertDialog";
import ReadingListToPrivateAlertDialog from "@/components/reading-list/dialogs/ReadingListToPrivateAlertDialog";
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
import { ReadingListVisibility } from "@/types/database.types";
import { ReactNode, useState } from "react";

type ReadingListActionsPopoverProps = {
  children: ReactNode;
  isOwned: boolean;
  isDefault: boolean;
  visibility: ReadingListVisibility;
  isDeleting: boolean;
  isUpdating: boolean;
  deleteMutation: () => void;
  updateVisibilityMutation: (visibility: "public" | "private") => void;
};

const ReadingListActionsPopover = ({
  children,
  isOwned,
  isDefault,
  visibility,
  isDeleting,
  isUpdating,
  deleteMutation,
  updateVisibilityMutation,
}: ReadingListActionsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isPublic = visibility === "public";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Copy link
              </PopoverButton>
              <PopoverButton
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Edit list info
              </PopoverButton>
              <PopoverButton
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Remove items
              </PopoverButton>
              {isPublic && (
                <ReadingListToPrivateAlertDialog
                  isUpdating={isUpdating}
                  handleUpdate={() => {
                    updateVisibilityMutation("private");
                    setIsOpen(false);
                  }}
                >
                  <PopoverButton>Make list private</PopoverButton>
                </ReadingListToPrivateAlertDialog>
              )}
              {!isPublic && (
                <PopoverButton
                  onClick={() => {
                    updateVisibilityMutation("public");
                    setIsOpen(false);
                  }}
                >
                  Make list public
                </PopoverButton>
              )}
              <PopoverButton>Reorder items</PopoverButton>

              {!isDefault && (
                <ReadingListDeletionAlertDialog
                  isDeleting={isDeleting}
                  handleDelete={deleteMutation}
                >
                  <PopoverButton variant="danger">Delete list</PopoverButton>
                </ReadingListDeletionAlertDialog>
              )}
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

export default ReadingListActionsPopover;
