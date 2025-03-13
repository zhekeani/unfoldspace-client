"use client";

import { EditorContent, JSONContent } from "@tiptap/react";
import { useRef } from "react";

import { useStoryEditor } from "@/components/context/StoryEditorContext";
import ImageBlockMenu from "@/components/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { useBlockEditor } from "@/components/editor/hooks/useBlockEditor";
import { useBlockEditorAutoScroll } from "@/components/editor/hooks/useBlockEditorAutoScroll";
import { useStorySave } from "@/components/editor/hooks/useStorySave";
import { extractImageUrlsFromJSONContent } from "@/lib/editor/utils/extractImages";
import { StoryDetail } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";
import FloatingTextMenu from "../menus/FloatingTextMenu/FloatingTextMenu";
import LinkMenu from "../menus/LinkMenu/LinkMenu";
import { TextMenu } from "../menus/TextMenu/TextMenu";

interface BlockEditorProps {
  initialContent?: JSONContent;
}

const BlockEditor = ({ initialContent }: BlockEditorProps) => {
  const menuContainerRef = useRef(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const { onContentChange } = useStorySave();
  const {
    isEditable,
    coverImage,
    setCoverImage,
    storyQueryKey,
    setSavedStatus,
  } = useStoryEditor();
  const queryClient = useQueryClient();
  const currentStory = queryClient.getQueryData<StoryDetail>(storyQueryKey);

  const checkUnsave = (currentContent: JSONContent) => {
    if (currentStory) {
      if (currentStory.json_content !== currentContent) {
        setSavedStatus("unsaved");
      }
    }
  };

  const { editor } = useBlockEditor({
    content: initialContent || { type: "doc", content: [] },
    editable: isEditable,
    onTransaction({ editor: currentEditor }) {
      const newContent = currentEditor.getJSON();
      checkUnsave(newContent);

      onContentChange(newContent);
      const images = extractImageUrlsFromJSONContent(newContent);
      if (!coverImage && images.length > 0) {
        setCoverImage(images[0]);
      }
      if (coverImage && images.length === 0) {
        setCoverImage(null);
      }
    },
  });

  useBlockEditorAutoScroll(editor);

  if (!editor) return null;

  return (
    <div
      className="story-editor h-screen flex flex-col items-center"
      ref={menuContainerRef}
    >
      <div
        className="relative w-full max-w-3xl flex-1 flex flex-col bg-white"
        ref={editorWrapperRef}
      >
        <EditorContent
          editor={editor}
          className="story-editor-content flex-1 overflow-y-auto px-12 pt-12 pb-32"
        />
      </div>
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <TextMenu editor={editor} />
      <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      <FloatingTextMenu editor={editor} editorWrapperRef={editorWrapperRef} />
    </div>
  );
};

export default BlockEditor;
