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
import { ReactNode, useState } from "react";
import EditorSelectImagePopover from "./components/EditorSelectImagePopover";

type ActionType = "image" | "title" | "topic" | null;

type EditorActionsPopoverProps = {
  children: ReactNode;
};

const EditorActionsPopover = ({ children }: EditorActionsPopoverProps) => {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isOpen, setIsOpen] = useState(false);

  const isNoAction = !actionType;
  const isImageAction = actionType === "image";
  const isTitleAction = actionType === "title";
  const isTopicAction = actionType === "topic";

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
        {isNoAction && (
          <div className="flex flex-col items-start">
            <PopoverGroup>
              <PopoverButton onClick={() => setActionType("image")}>
                Change featured image
              </PopoverButton>
              <PopoverButton>Change display tile/subtitle</PopoverButton>
              <PopoverButton>Change topics</PopoverButton>
            </PopoverGroup>
            <PopoverDivider />
            <PopoverGroup>
              <PopoverButton>Hints and keyboard shortcuts</PopoverButton>
            </PopoverGroup>
          </div>
        )}
        {isImageAction && (
          <EditorSelectImagePopover resetAction={() => setActionType(null)} />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EditorActionsPopover;
