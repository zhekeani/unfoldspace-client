import { useStoryEditor } from "@/components/context/StoryEditorContext";
import useTitleDescForm from "@/components/editor/hooks/useTitleDescForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Story } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";

const StoryPublicationDialogTitleDescForm = () => {
  const queryClient = useQueryClient();
  const { storyQueryKey } = useStoryEditor();

  const story = queryClient.getQueryData<Story | null>(storyQueryKey);

  const { form, debouncedSubmit } = useTitleDescForm(
    story || null,
    queryClient,
    storyQueryKey
  );

  return (
    <Form {...form}>
      <form className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="previewTitle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  minLength={5}
                  maxLength={100}
                  placeholder="Write a preview title"
                  className="!text-lg font-medium border-x-0 border-t-0 rounded-none text-main-text placeholder:text-sub-text/50 shadow-none border-b-[2px] px-0 focus-visible:ring-0 focus-visible:border-b-main-text"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedSubmit(form.getValues());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewSubtitle"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  minLength={10}
                  maxLength={300}
                  placeholder="Write a preview subtitle..."
                  className="!text-sm font-base border-x-0 border-t-0 rounded-none text-main-text placeholder:text-sub-text/50 shadow-none border-b-[2px] px-0 focus-visible:ring-0 focus-visible:border-b-main-text"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
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

export default StoryPublicationDialogTitleDescForm;
