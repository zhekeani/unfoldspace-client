import { Editor } from "@tiptap/react";
import { RefObject, useEffect, useState } from "react";

export const useFloatingTextMenu = (
  editor: Editor,
  editorWrapperRef: RefObject<HTMLDivElement | null>
) => {
  const [isCurrentNodeEmpty, setIsCurrentNodeEmpty] = useState(false);
  const [top, setTop] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(editor.isFocused); // Track focus state

  useEffect(() => {
    if (!editor) return;

    const updateEmptyState = () => {
      const { state } = editor;
      const { selection } = state;
      const node = selection.$head.node();

      if (node.type.name === "paragraph" && node.textContent.trim() === "") {
        setIsCurrentNodeEmpty(true);
        const { top } = editor.view.coordsAtPos(selection.$head.pos);
        setTop(top);
      } else {
        setIsCurrentNodeEmpty(false);
        setTop(null);
      }
    };

    // Focus and Blur Handlers
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Attach event listeners
    editor.on("selectionUpdate", updateEmptyState);
    editor.on("transaction", updateEmptyState);
    editor.on("focus", handleFocus);
    editor.on("blur", handleBlur);

    return () => {
      // Cleanup listeners
      editor.off("selectionUpdate", updateEmptyState);
      editor.off("transaction", updateEmptyState);
      editor.off("focus", handleFocus);
      editor.off("blur", handleBlur);
    };
  }, [editor]);

  // Update left position
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const updatePosition = () => {
      if (editorWrapperRef.current) {
        setLeft(editorWrapperRef.current.getBoundingClientRect().left);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition, { signal });

    return () => controller.abort();
  }, [editorWrapperRef]);

  // Update top position on scroll
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const handleScroll = () => {
      const { selection } = editor.state;
      const { top } = editor.view.coordsAtPos(selection.$head.pos);
      setTop(top);
    };

    window.addEventListener("scroll", handleScroll, { signal });

    return () => controller.abort();
  }, [editor]);

  return { isCurrentNodeEmpty, top, left, isFocused };
};
