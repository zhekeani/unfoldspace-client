import { Editor } from "@tiptap/react";
import { useEffect } from "react";

const SCROLL_PADDING = 100; // Adjust this value for extra bottom space

export const useBlockEditorAutoScroll = (editor: Editor | null) => {
  useEffect(() => {
    const handleScrollAdjustment = () => {
      if (!editor) return;

      const caretRect = editor.view.coordsAtPos(
        editor.state.selection.$anchor.pos
      );
      const windowHeight = window.innerHeight;

      const distanceToBottom = windowHeight - caretRect.bottom;

      if (distanceToBottom < SCROLL_PADDING) {
        window.scrollBy({
          top: SCROLL_PADDING - distanceToBottom,
          behavior: "smooth",
        });
      }
    };

    // Attach event listener to keypresses
    editor?.on("update", handleScrollAdjustment);
    editor?.on("selectionUpdate", handleScrollAdjustment);
    editor?.on("focus", handleScrollAdjustment);

    return () => {
      editor?.off("update", handleScrollAdjustment);
      editor?.off("selectionUpdate", handleScrollAdjustment);
      editor?.off("focus", handleScrollAdjustment);
    };
  }, [editor]);

  return null;
};
