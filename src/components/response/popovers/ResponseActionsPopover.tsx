import {
  PopoverButton,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode, useState } from "react";
import ResponseDeletionAlertDialog from "../dialogs/ResponseDeletionAlertDialog";

type responseActionsPopoverProps = {
  isEditorOpen: boolean;
  setIsEditorOpen: (isOpen: boolean) => void;
  responseId: string;
  isAuthor: boolean;
  handleDelete: () => void;
  isDeleting: boolean;
  children: ReactNode;
};

const ResponseActionsPopover = ({
  setIsEditorOpen,
  isAuthor,
  isDeleting,
  handleDelete,
  children,
}: responseActionsPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEditorOpen = () => {
    setIsEditorOpen(true);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        {isAuthor && (
          <div>
            <PopoverGroup>
              <PopoverButton onClick={handleEditorOpen}>
                Edit response
              </PopoverButton>
              <ResponseDeletionAlertDialog
                isDeleting={isDeleting}
                handleDelete={handleDelete}
              >
                <PopoverButton variant="danger">Delete response</PopoverButton>
              </ResponseDeletionAlertDialog>
            </PopoverGroup>
          </div>
        )}
        {!isAuthor && (
          <div>
            <PopoverGroup>
              <PopoverButton>Report response</PopoverButton>
            </PopoverGroup>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ResponseActionsPopover;
