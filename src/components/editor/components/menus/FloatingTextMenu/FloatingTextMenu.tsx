import { Editor } from "@tiptap/react";
import { RefObject, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { useFloatingTextMenu } from "./hooks/useFloatingTextMenu";

import { EditorDropdownButton } from "@/components/editor/components/ui/EditorDropdown";
import { EditorToolbar } from "@/components/editor/components/ui/EditorToolbar";
import { Surface } from "@/components/editor/components/ui/Surface";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import BlockTypeCategoryTitle from "./components/BlockTypeCategoryTitle";
import { ImageLinkDialog } from "./components/ImageLinkDialog";
import ItemDivider from "./components/ItemDivider";
import { useFloatingTextMenuCommands } from "./hooks/useFloatingTextMenuCommands";
import { useFloatingTextMenuBlockTypes } from "./hooks/userFloatingTextMenuBlockTypes";

export type BlockTypePickerOption = {
  label: string;
  id: string;
  onClick: (...args: unknown[]) => void;
  icon: keyof typeof icons;
};

export type FloatingTextMenuProps = {
  editor: Editor;
  editorWrapperRef: RefObject<HTMLDivElement | null>;
};

const FloatingTextMenu = ({
  editor,
  editorWrapperRef,
}: FloatingTextMenuProps) => {
  const { isCurrentNodeEmpty, top, left } = useFloatingTextMenu(
    editor,
    editorWrapperRef
  );
  const commands = useFloatingTextMenuCommands(editor);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const { imageOptions, quoteOptions } = useFloatingTextMenuBlockTypes(
    editor,
    () => setImageDialogOpen(true)
  );

  const handleInsertImage = (url: string) => {
    commands.onImageLink(url);
  };

  if (left === null || top === null) return null;

  return (
    <>
      {/* Image-link dialog */}
      <ImageLinkDialog
        isOpen={isImageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onSubmit={handleInsertImage}
      />

      {isCurrentNodeEmpty && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <EditorToolbar.Button
              style={{ top: top, left: left - 8 }}
              className={cn(
                "fixed hidden  md:flex items-center gap-1 z-[50] rounded-xl border-[1px] border-sub-text hover:text-main-text aspect-square transition-colors"
              )}
              onMouseDown={(event) => event.preventDefault()} // Prevent editor blur
            >
              <LucideIcon name="Plus" className="!w-5 !h-5" />
            </EditorToolbar.Button>
          </Popover.Trigger>
          <Popover.Content side="right" align="start" sideOffset={8}>
            <Surface className="p-2 flex flex-col items-start justify-center">
              <BlockTypeCategoryTitle title="Image" />
              {imageOptions.map((option) => (
                <Popover.Close key={option.id} asChild>
                  <EditorDropdownButton
                    className="font-normal"
                    onClick={option.onClick}
                  >
                    <LucideIcon name={option.icon} />
                    {option.label}
                  </EditorDropdownButton>
                </Popover.Close>
              ))}

              <ItemDivider />

              <BlockTypeCategoryTitle title="Quote" />
              {quoteOptions.map((option) => (
                <Popover.Close key={option.id} asChild>
                  <EditorDropdownButton
                    className="font-normal"
                    onClick={option.onClick}
                  >
                    <LucideIcon name={option.icon} />
                    {option.label}
                  </EditorDropdownButton>
                </Popover.Close>
              ))}

              <ItemDivider />

              <BlockTypeCategoryTitle title="Other" />

              <Popover.Close asChild>
                <EditorDropdownButton
                  className="font-normal"
                  onClick={commands.onCodeBlock}
                >
                  <LucideIcon name="FileCode2" />
                  Code block
                </EditorDropdownButton>
              </Popover.Close>

              <Popover.Close asChild>
                <EditorDropdownButton
                  className="font-normal"
                  onClick={commands.onHorizontalRule}
                >
                  <LucideIcon name="SeparatorHorizontal" />
                  Section ruler
                </EditorDropdownButton>
              </Popover.Close>
            </Surface>
          </Popover.Content>
        </Popover.Root>
      )}
    </>
  );
};

export default FloatingTextMenu;
