import { createContext, ReactNode, useContext, useState } from "react";

type StoryDetailContextType = {
  storyDetailQueryKey: string[];
  topicsQueryKey: string[];
  userQueryKey: string[];
  responsesQueryKey: string[];

  isResSheetOpen: boolean;
  setResSheetOpen: (isOpen: boolean) => void;
};

const StoryDetailContext = createContext<StoryDetailContextType | undefined>(
  undefined
);

type StoryDetailProviderProps = {
  storyDetailQueryKey: string[];
  topicsQueryKey: string[];
  userQueryKey: string[];
  responsesQueryKey: string[];
  children: ReactNode;
};

export const StoryDetailProvider = ({
  children,
  storyDetailQueryKey,
  topicsQueryKey,
  userQueryKey,
  responsesQueryKey,
}: StoryDetailProviderProps) => {
  const [isResSheetOpen, setResSheetOpen] = useState(false);

  return (
    <StoryDetailContext.Provider
      value={{
        storyDetailQueryKey,
        topicsQueryKey,
        userQueryKey,
        responsesQueryKey,
        isResSheetOpen,
        setResSheetOpen,
      }}
    >
      {children}
    </StoryDetailContext.Provider>
  );
};

export const useStoryDetail = () => {
  const context = useContext(StoryDetailContext);
  if (!context) {
    throw new Error("useStoryDetail must be used within a StoryDetailProvider");
  }
  return context;
};
