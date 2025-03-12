import { updateStoryTopics } from "@/actions/story/updateStory";
import { Story } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const topicsSchema = z.object({
  topics: z
    .array(z.string())
    .max(5, "You can select up to 5 topics")
    .optional(),
});

const useTopicsForm = (
  story: Story | null,
  queryClient: QueryClient,
  storyQueryKey: string[]
) => {
  const form = useForm<z.infer<typeof topicsSchema>>({
    resolver: zodResolver(topicsSchema),
    defaultValues: { topics: story ? (story.topic_ids as string[]) : [] },
    mode: "onChange",
  });

  const { watch } = form;
  const topicsValue = watch("topics");

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (args: { storyId: string; topicIds: string[] }) =>
      updateStoryTopics(args.storyId, args.topicIds),

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully update story topics.");

        queryClient.setQueryData(storyQueryKey, (oldData?: Story | null) => {
          if (!oldData) return oldData;

          const insertedTopicIds = res.data.topicIds;
          return {
            ...oldData,
            topic_ids: insertedTopicIds,
          };
        });

        queryClient.invalidateQueries({ queryKey: storyQueryKey });
      }
    },
  });

  const debouncedSubmit = useRef(
    _.debounce(async (values: z.infer<typeof topicsSchema>) => {
      console.log("Debounced values:", values); // Debugging

      if (
        story &&
        !isUpdating &&
        form.formState.isValid &&
        JSON.stringify(values.topics) !==
          JSON.stringify(story ? (story.topic_ids as string[]) : [])
      ) {
        updateMutation({ storyId: story.id, topicIds: values.topics || [] });
      } else {
        console.log("No changes detected, skipping submit.");
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSubmit(form.getValues());
  }, [debouncedSubmit, form, topicsValue]);

  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  return { form, debouncedSubmit };
};

export default useTopicsForm;
