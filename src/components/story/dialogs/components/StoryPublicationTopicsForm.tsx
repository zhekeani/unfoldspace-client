import { useStoryEditor } from "@/components/context/StoryEditorContext";
import useTopicsForm from "@/components/editor/hooks/useTopicsForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Story } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";
import TopicMultiSelect from "./TopicMutlSelect";

const StoryPublicationTopicsForm = () => {
  const queryClient = useQueryClient();
  const { storyQueryKey, topics: availableTopics } = useStoryEditor();

  const story = queryClient.getQueryData<Story | null>(storyQueryKey);

  const { form, debouncedSubmit } = useTopicsForm(
    story || null,
    queryClient,
    storyQueryKey
  );

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
                  value={field.value || []}
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
