import { addStoryDraft } from "@/actions/story/addStory";
import { useStoryEditor } from "@/components/context/StoryEditorContext";
import { useQueryClient } from "@tanstack/react-query";
import { Editor, JSONContent } from "@tiptap/react";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";

export function isJsonContentEmpty(jsonContent: JSONContent): boolean {
  if (!jsonContent?.content || jsonContent.content.length === 0) {
    return true;
  }

  return jsonContent.content.every((node) => {
    if (node.type !== "paragraph") return false;

    const hasText = node.content?.some((child) => child.text?.trim());
    return !hasText;
  });
}

export const useStorySave = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransition] = useTransition();

  const { storyId, setStoryId, savedStatus, setSavedStatus, storyQueryKey } =
    useStoryEditor();

  const debounceSave = useRef(
    _.debounce(async (providedStoryId: string, content: JSONContent) => {
      if (savedStatus === "saving" || savedStatus === "saved") return;
      setSavedStatus("saving");

      console.log("Auto-saving story...", providedStoryId);

      const response = await addStoryDraft(
        providedStoryId,
        content,
        JSON.stringify(content)
      );

      if (!response.success || !response.data.draft.id) {
        console.error("Failed to auto-save:", response.error);
        setSavedStatus("error");
        return;
      }

      queryClient.setQueryData(storyQueryKey, () => {
        return {
          storyId,
          story: response.data.draft,
        };
      });

      setSavedStatus("saved");

      if (!storyId) {
        router.replace(`/editor?storyId=${providedStoryId}`);
      }

      queryClient.invalidateQueries({ queryKey: storyQueryKey });

      console.log("Story auto-saved successfully!", response.data.draft.id);
    }, 2000)
  ).current;

  useEffect(() => {
    debounceSave.cancel();
  }, [debounceSave, savedStatus]);

  const handleSaveNote = useCallback(
    async (editorRef: React.RefObject<Editor | null>) => {
      if (!storyId) {
        console.warn("Skipping save: No story ID.");
        return;
      }

      startTransition(async () => {
        if (!editorRef.current) return;

        try {
          setSavedStatus("saving");
          const finalContentJson = editorRef.current.getJSON();
          console.log(finalContentJson);
          console.log("Manual saving story...");

          const response = await addStoryDraft(
            storyId!,
            finalContentJson,
            JSON.stringify(finalContentJson)
          );

          if (!response.success || !response.data.draft.id) {
            console.error("Failed to save story:", response.error);
            setSavedStatus("error");
            return;
          }

          queryClient.setQueryData(storyQueryKey, () => {
            return {
              storyId,
              story: response.data.draft,
            };
          });

          setSavedStatus("saved");

          queryClient.invalidateQueries({ queryKey: storyQueryKey });

          console.log("Story saved successfully", response.data.draft.id);
        } catch (error) {
          console.error("Failed to save note:", error);
          setSavedStatus("error");
        }
      });
    },
    [storyId, setSavedStatus, queryClient, storyQueryKey]
  );

  const onContentChange = useCallback(
    (content: JSONContent) => {
      const currentStoryId = storyId ?? crypto.randomUUID();
      if (!isJsonContentEmpty(content)) {
        setStoryId(currentStoryId);

        // Auto-save
        debounceSave(currentStoryId, content);
      }
    },
    [debounceSave, setStoryId, storyId]
  );

  return { handleSaveNote, onContentChange };
};
