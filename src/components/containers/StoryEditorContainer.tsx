"use client";

import { useStoryEditor } from "@/components/context/StoryEditorContext";
import BlockEditor from "@/components/editor/components/BlockEditor/BlockEditor";
import { fetchStoryByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import { ServiceUser, Story, Topic } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";
import EditorHeader from "../header/editor-header/EditorHeader";

type StoryEditorContainer = {
  pageData: { story: Story; storyId: string } | null;
  activeUser: ServiceUser;
  topics: Topic[];
};

const StoryEditorContainer = ({
  pageData,
  activeUser,
}: StoryEditorContainer) => {
  const { storyQueryKey } = useStoryEditor();

  const { data: story, error } = useQuery({
    queryKey: storyQueryKey,
    queryFn: () => fetchStoryByIdOnClient(pageData!.storyId),
    enabled: !!pageData && !!pageData.storyId,
    initialData: pageData?.story,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
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

export default StoryEditorContainer;
