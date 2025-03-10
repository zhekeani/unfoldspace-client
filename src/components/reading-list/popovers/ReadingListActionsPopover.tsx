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
import { ReadingList, ReadingListVisibility } from "@/types/database.types";
import { ReactNode, useState } from "react";
import ReadingListCreationDialog from "../dialogs/ReadingListCreationDialog";

type ReadingListActionsPopoverProps = {
  children: ReactNode;
  readingList: ReadingList;
  listQueryKey: string[];
  listsQueryKey: string[];
  isOwned: boolean;
  isDefault: boolean;
  visibility: ReadingListVisibility;
  isUpdating: boolean;
  updateVisibilityMutation: (visibility: "public" | "private") => void;
};

const ReadingListActionsPopover = ({
  children,
  readingList,
  listQueryKey,
  listsQueryKey,
  isOwned,
  isDefault,
  visibility,
  isUpdating,
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
              <ReadingListCreationDialog
                actionType="update"
                readingListId={readingList.id}
                initialValues={{
                  name: readingList.title,
                  description: readingList.description || "",
                  visibility: readingList.visibility,
                }}
                listsQueryKey={listsQueryKey}
                listQueryKey={listQueryKey}
              >
                <PopoverButton>Edit list info</PopoverButton>
              </ReadingListCreationDialog>
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
                  listId={readingList.id}
                  listsQueryKey={listsQueryKey}
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
