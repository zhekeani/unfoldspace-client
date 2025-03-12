import { createContext, ReactNode, useContext } from "react";

type StoryDetailContextType = {
  storyDetailQueryKey: string[];
  topicsQueryKey: string[];
  userQueryKey: string[];
  responsesQueryKey: string[];
};

const StoryDetailContext = createContext<StoryDetailContextType | undefined>(
  undefined
);

type StoryDetailProviderProps = StoryDetailContextType & {
  children: ReactNode;
};

export const StoryDetailProvider = ({
  children,
  storyDetailQueryKey,
  topicsQueryKey,
  userQueryKey,
  responsesQueryKey,
}: StoryDetailProviderProps) => {
  return (
    <StoryDetailContext.Provider
      value={{
        storyDetailQueryKey,
        topicsQueryKey,
        userQueryKey,
        responsesQueryKey,
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
