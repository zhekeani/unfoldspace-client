import { Editor } from "@tiptap/react";
import { useCallback } from "react";
import { BlockTypePickerOption } from "../FloatingTextMenu";

export const useFloatingTextMenuBlockTypes = (
  editor: Editor,
  openImageDialog: () => void
) => {
  const imageOptions: BlockTypePickerOption[] = [
    {
      icon: "Image",
      label: "Upload image",
      id: "UploadImage",
      onClick: useCallback(() => {
        editor.chain().focus().setImageUpload().run();
      }, [editor]),
    },
    {
      icon: "Link2",
      label: "Link image",
      id: "LinkImage",
      onClick: useCallback(() => openImageDialog(), [openImageDialog]),
    },
  ];

  const quoteOptions: BlockTypePickerOption[] = [
    {
      icon: "Quote",
      label: "Quote",
      id: "Quote",
      onClick: useCallback(
        () => editor.chain().focus().setBlockquote().run(),
        [editor]
      ),
    },
    {
      icon: "MessageSquareQuote",
      label: "Loud quote",
      id: "LoudQuote",
      onClick: useCallback(
        () => editor.chain().focus().setLargeBlockquote().run(),
        [editor]
      ),
    },
  ];

  return {
    imageOptions,
    quoteOptions,
  };
};
