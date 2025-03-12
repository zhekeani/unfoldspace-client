import * as Popover from "@radix-ui/react-popover";
import { BubbleMenu, Editor } from "@tiptap/react";
import { memo } from "react";

import { ColorPicker } from "@/components/editor/components/panels/ColorPicker/ColorPicker";

import { EditorToolbar } from "@/components/editor/components/ui/EditorToolbar";
import { Surface } from "@/components/editor/components/ui/Surface";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { ContentTypePicker } from "./components/ContentTypePicker";
import { EditLinkPopover } from "./components/EditLinkPopover";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands";
import { useTextmenuContentTypes } from "./hooks/useTextmenuContentTypes";
import { useTextmenuStates } from "./hooks/useTextmenuStates";

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoButton = memo(EditorToolbar.Button);
const MemoColorPicker = memo(ColorPicker);
const MemoContentTypePicker = memo(ContentTypePicker);

export type TextMenuProps = {
  editor: Editor;
};

export const TextMenu = ({ editor }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);
  const blockOptions = useTextmenuContentTypes(editor);

  return (
    <BubbleMenu
      tippyOptions={{
        popperOptions: {
          placement: "top-start",
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
              },
            },
          ],
        },
        offset: [0, 8],
        maxWidth: "calc(100vw - 16px)",
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={0}
    >
      <EditorToolbar.Wrapper>
        <EditorToolbar.Divider />
        <MemoContentTypePicker options={blockOptions} />
        <EditorToolbar.Divider />
        <MemoButton onClick={commands.onBold} active={states.isBold}>
          <LucideIcon name="Bold" />
        </MemoButton>
        <MemoButton onClick={commands.onItalic} active={states.isItalic}>
          <LucideIcon name="Italic" />
        </MemoButton>
        <MemoButton onClick={commands.onUnderline} active={states.isUnderline}>
          <LucideIcon name="Underline" />
        </MemoButton>
        <MemoButton onClick={commands.onStrike} active={states.isStrike}>
          <LucideIcon name="Strikethrough" />
        </MemoButton>
        <MemoButton onClick={commands.onQuoteBlock} active={states.isStrike}>
          <LucideIcon name="Quote" />
        </MemoButton>
        <MemoButton onClick={commands.onCode} active={states.isCode}>
          <LucideIcon name="Code" />
        </MemoButton>
        <MemoButton onClick={commands.onCodeBlock}>
          <LucideIcon name="FileCode" />
        </MemoButton>
        <EditLinkPopover onSetLink={commands.onLink} />
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentHighlight}>
              <LucideIcon name="Highlighter" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentHighlight}
                onChange={commands.onChangeHighlight}
                onClear={commands.onClearHighlight}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton active={!!states.currentColor}>
              <LucideIcon name="Palette" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" sideOffset={8} asChild>
            <Surface className="p-1">
              <MemoColorPicker
                color={states.currentColor}
                onChange={commands.onChangeColor}
                onClear={commands.onClearColor}
              />
            </Surface>
          </Popover.Content>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton>
              <LucideIcon name="EllipsisVertical" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" asChild>
            <EditorToolbar.Wrapper>
              <MemoButton
                onClick={commands.onSubscript}
                active={states.isSubscript}
              >
                <LucideIcon name="Subscript" />
              </MemoButton>
              <MemoButton
                onClick={commands.onSuperscript}
                active={states.isSuperscript}
              >
                <LucideIcon name="Superscript" />
              </MemoButton>
              <EditorToolbar.Divider />
              <MemoButton
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <LucideIcon name="AlignLeft" />
              </MemoButton>
              <MemoButton
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <LucideIcon name="AlignCenter" />
              </MemoButton>
              <MemoButton
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <LucideIcon name="AlignRight" />
              </MemoButton>
              <MemoButton
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <LucideIcon name="AlignJustify" />
              </MemoButton>
            </EditorToolbar.Wrapper>
          </Popover.Content>
        </Popover.Root>
      </EditorToolbar.Wrapper>
    </BubbleMenu>
  );
};
