import { createContext, ReactNode, useContext, useState } from "react";
import { Topic } from "../../types/database.types";

export type EditorSaveStatus = "unsaved" | "saving" | "saved" | "error";

type StoryEditorContextType = {
  storyId: string | null;
  setStoryId: (storyId: string | null) => void;

  savedStatus: EditorSaveStatus;
  setSavedStatus: (status: EditorSaveStatus) => void;

  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;

  coverImage: string | null;
  setCoverImage: (image: string) => void;

  storyQueryKey: string[];
  topics: Topic[];
};

const StoryEditorContext = createContext<StoryEditorContextType | undefined>(
  undefined
);

type StoryEditorProviderProps = {
  initialStoryId: string | null;
  activeUserId: string;
  children: ReactNode;
  topics: Topic[];
};

export const StoryEditorProvider = ({
  initialStoryId,
  activeUserId,
  children,
  topics,
}: StoryEditorProviderProps) => {
  const [isEditable, setIsEditable] = useState(true);
  const [storyId, setStoryId] = useState(initialStoryId);
  const [savedStatus, setSavedStatus] = useState<EditorSaveStatus>("unsaved");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const storyQueryKey = ["story", activeUserId];

  return (
    <StoryEditorContext.Provider
      value={{
        storyId,
        setStoryId,
        isEditable,
        setIsEditable,
        storyQueryKey,
        savedStatus,
        setSavedStatus,
        coverImage,
        setCoverImage,
        topics,
      }}
    >
      {children}
    </StoryEditorContext.Provider>
  );
};

export const useStoryEditor = () => {
  const context = useContext(StoryEditorContext);
  if (!context) {
    throw new Error("useStoryEditor must be used within a StoryEditorProvider");
  }
  return context;
};
