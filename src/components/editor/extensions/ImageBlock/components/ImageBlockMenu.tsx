import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";
import { JSX, useCallback, useRef } from "react";
import { Instance, sticky } from "tippy.js";
import { ImageBlockWidth } from "./ImageBlockWidth";

import { EditorToolbar } from "@/components/editor/components/ui/EditorToolbar";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { getRenderContainer } from "@/lib/editor/utils";
import { MenuProps } from "@/types/editor.types";
import { v4 as uuid } from "uuid";

export const ImageBlockMenu = ({
  editor,
  appendTo,
}: MenuProps): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "node-imageBlock");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("imageBlock");

    return isActive;
  }, [editor]);

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("right")
      .run();
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor]
  );
  const { isImageCenter, isImageLeft, isImageRight, width } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isImageLeft: ctx.editor.isActive("imageBlock", { align: "left" }),
        isImageCenter: ctx.editor.isActive("imageBlock", { align: "center" }),
        isImageRight: ctx.editor.isActive("imageBlock", { align: "right" }),
        width: parseInt(ctx.editor.getAttributes("imageBlock")?.width || 0),
      };
    },
  });

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance;
        },
        appendTo: () => {
          return appendTo?.current;
        },
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      <EditorToolbar.Wrapper shouldShowContent={shouldShow()} ref={menuRef}>
        <EditorToolbar.Button active={isImageLeft} onClick={onAlignImageLeft}>
          <LucideIcon name="AlignHorizontalDistributeStart" />
        </EditorToolbar.Button>
        <EditorToolbar.Button
          active={isImageCenter}
          onClick={onAlignImageCenter}
        >
          <LucideIcon name="AlignHorizontalDistributeCenter" />
        </EditorToolbar.Button>
        <EditorToolbar.Button active={isImageRight} onClick={onAlignImageRight}>
          <LucideIcon name="AlignHorizontalDistributeEnd" />
        </EditorToolbar.Button>
        <EditorToolbar.Divider />
        <ImageBlockWidth onChange={onWidthChange} value={width} />
      </EditorToolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default ImageBlockMenu;
