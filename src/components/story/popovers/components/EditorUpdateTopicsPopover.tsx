import { useStoryEditor } from "@/components/context/StoryEditorContext";
import useTopicsForm from "@/components/editor/hooks/useTopicsForm";
import TopicMultiSelect from "@/components/story/dialogs/components/TopicMutlSelect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Story } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";

type EditorUpdateTopisPopoverProps = {
  resetAction: () => void;
};

const EditorUpdateTopicsPopover = ({
  resetAction,
}: EditorUpdateTopisPopoverProps) => {
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
      <form className="p-[15px] w-[308px]">
        <div className="my-[15px]">
          <p className="text-xs-sm text-sub-text">
            Add or change topics (up to 5) so readers know what your stroy is
            about:
          </p>
        </div>
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

        <Button
          className="rounded-full font-light mt-6 mb-[15px] text-sub-text"
          onClick={resetAction}
          variant={"outline"}
          type="button"
        >
          Done
        </Button>
      </form>
    </Form>
  );
};

export default EditorUpdateTopicsPopover;
