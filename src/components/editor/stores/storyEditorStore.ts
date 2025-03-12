import { JSONContent } from "@tiptap/react";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

export type SaveStatus = "unsaved" | "saving" | "saved" | "error";

type EditorState = {
  content: JSONContent | null;
  storyId: string | null;
  saveStatus: SaveStatus;
  isEditable: boolean;
  isContentEmpty: boolean;
  isNewStory: boolean;
  setIsNewStory: (isNewStory: boolean) => void;
  setContent: (newContent: JSONContent) => void;
  setStoryId: (id: string | null) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setIsEditable: (status: boolean) => void;
};

const computeIsContentEmpty = (content: JSONContent | null): boolean => {
  if (!content || !content.content || content.content.length === 0) return true;
  return (
    content.content.length === 1 &&
    content.content[0].type === "paragraph" &&
    !content.content[0].content
  );
};

const useEditorStore = create<EditorState>((set) => ({
  content: null,
  storyId: null,
  saveStatus: "unsaved",
  isEditable: true,
  isContentEmpty: true,
  isNewStory: false,
  setIsNewStory: (isNew) => set({ isNewStory: isNew }),
  setContent: (newContent) =>
    set((state) => {
      if (shallow(state.content, newContent)) return state;

      return {
        content: newContent,
        isContentEmpty: computeIsContentEmpty(newContent),
        saveStatus: "unsaved",
      };
    }),
  setStoryId: (id) => set({ storyId: id }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setIsEditable: (status) => set({ isEditable: status }),
}));

export default useEditorStore;
