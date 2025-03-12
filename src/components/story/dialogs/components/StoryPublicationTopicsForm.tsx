import { updateStoryTopics } from "@/actions/story/updateStory";
import { useStoryEditor } from "@/components/context/StoryEditorContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Story } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TopicMultiSelect from "./TopicMutlSelect";

const topicsSchema = z.object({
  topics: z
    .array(z.string())
    .min(1, "At least one topic is required")
    .max(5, "You can select up to 5 topics"),
});

const StoryPublicationTopicsForm = () => {
  const queryClient = useQueryClient();
  const { storyQueryKey, topics: availableTopics } = useStoryEditor();

  const story = queryClient.getQueryData<Story | null>(storyQueryKey);

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
        updateMutation({ storyId: story.id, topicIds: values.topics });
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

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TopicMultiSelect
                  availableTopics={availableTopics}
                  value={field.value}
                  onChange={(selectedTopics) => {
                    field.onChange(selectedTopics);
                    debouncedSubmit(form.getValues());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default StoryPublicationTopicsForm;
