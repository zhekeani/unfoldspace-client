import { useCallback } from "react";
import { Editor } from "@tiptap/react";

export const useFloatingTextMenuCommands = (editor: Editor) => {
  const onCodeBlock = useCallback(
    () => editor.chain().focus().toggleCodeBlock().run(),
    [editor]
  );

  const onHorizontalRule = useCallback(
    () => editor.chain().focus().setHorizontalRule().run(),
    [editor]
  );

  const onImageLink = useCallback(
    (url: string) => editor.chain().focus().setImageBlock({ src: url }).run(),
    [editor]
  );

  const onImageUpload = useCallback(() => {
    editor.chain().focus().setImageUpload().run();
  }, [editor]);

  return {
    onHorizontalRule,
    onCodeBlock,
    onImageLink,
    onImageUpload,
  };
};
