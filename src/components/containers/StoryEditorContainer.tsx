"use client";

import {
  StoryEditorProvider,
  useStoryEditor,
} from "@/components/context/StoryEditorContext";
import BlockEditor from "@/components/editor/components/BlockEditor/BlockEditor";
import { fetchStoryByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { ServiceUser, Story, Topic } from "@/types/database.types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";
import { useState } from "react";
import EditorHeader from "../header/editor-header/EditorHeader";

type StoryEditorContainer = {
  pageData: { story: Story; storyId: string } | null;
  activeUser: ServiceUser;
  topics: Topic[];
};

const InnerStoryEditorContainer = ({
  pageData,
  activeUser,
}: StoryEditorContainer) => {
  const { storyQueryKey } = useStoryEditor();

  const { data: story, error } = useQuery({
    queryKey: storyQueryKey,
    queryFn: () => fetchStoryByIdOnClient(pageData!.storyId),
    enabled: !!pageData && !!pageData.storyId,
    initialData: pageData?.story,
    staleTime: 5 * 60 * 1000,
  });

  if (error) return null;

  return (
    <div>
      <div className="h-[57px] min-h-[57px] w-full">
        <EditorHeader activeUser={activeUser} />
      </div>
      <BlockEditor
        initialContent={story ? (story.json_content as JSONContent) : undefined}
      />
    </div>
  );
};

const StoryEditorContainer = (props: StoryEditorContainer) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StoryEditorProvider
        topics={props.topics}
        activeUserId={props.activeUser.id}
        initialStoryId={props.pageData ? props.pageData.storyId : null}
      >
        <InnerStoryEditorContainer {...props} />
      </StoryEditorProvider>
    </QueryClientProvider>
  );
};

export default StoryEditorContainer;
