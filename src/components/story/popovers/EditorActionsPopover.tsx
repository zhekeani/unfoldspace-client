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
import EditorUpdateTitlePopover from "./components/EditorUpdateTitlePopover";
import EditorUpdateTopicsPopover from "./components/EditorUpdateTopicsPopover";
import { useStoryEditor } from "../../context/StoryEditorContext";

type ActionType = "image" | "title" | "topic" | null;

type EditorActionsPopoverProps = {
  children: ReactNode;
};

const EditorActionsPopover = ({ children }: EditorActionsPopoverProps) => {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { storyId } = useStoryEditor();

  const isNoAction = !actionType;
  const isImageAction = actionType === "image";
  const isTitleAction = actionType === "title";
  const isTopicAction = actionType === "topic";

  const toggleIsOpen = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setActionType(null);
      }
      return !prev;
    });
  };

  return (
    <Popover onOpenChange={toggleIsOpen} open={isOpen}>
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
              <PopoverButton
                disabled={!storyId}
                onClick={() => setActionType("image")}
              >
                Change featured image
              </PopoverButton>
              <PopoverButton
                disabled={!storyId}
                onClick={() => setActionType("title")}
              >
                Change display title/subtitle
              </PopoverButton>
              <PopoverButton
                disabled={!storyId}
                onClick={() => setActionType("topic")}
              >
                Change topics
              </PopoverButton>
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
        {isTitleAction && (
          <EditorUpdateTitlePopover resetAction={() => setActionType(null)} />
        )}
        {isTopicAction && (
          <EditorUpdateTopicsPopover resetAction={() => setActionType(null)} />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EditorActionsPopover;
