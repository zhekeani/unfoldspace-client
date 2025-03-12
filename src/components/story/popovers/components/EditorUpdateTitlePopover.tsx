import { useStoryEditor } from "@/components/context/StoryEditorContext";
import useTitleDescForm from "@/components/editor/hooks/useTitleDescForm";
import { Button } from "@/components/ui/button";
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

type EditorUpdateTitlePopoverProps = {
  resetAction: () => void;
};

const EditorUpdateTitlePopover = ({
  resetAction,
}: EditorUpdateTitlePopoverProps) => {
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
      <form className="p-[15px] w-[400px]">
        <div className="pr-5 pl-2">
          <div className="">
            <FormField
              control={form.control}
              name="previewTitle"
              render={({ field }) => (
                <FormItem className="flex items-center gap-5 py-[15px]">
                  <div className="w-[68px] text-sm text-sub-text">
                    <p>Title</p>
                  </div>
                  <FormControl>
                    <Input
                      minLength={5}
                      maxLength={100}
                      placeholder="Write a preview title"
                      className="!text-sm font-normal border-x-0 border-t-0 rounded-none text-main-text placeholder:text-sub-text/50 shadow-none border-b-[1px] px-0 focus-visible:ring-0 focus-visible:border-b-main-text"
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
                <FormItem className="flex items-center gap-5 py-[15px]">
                  <div className="w-[68px] text-sm text-sub-text">
                    <p>Subtitle</p>
                  </div>
                  <FormControl>
                    <Input
                      minLength={10}
                      maxLength={300}
                      placeholder="Write a preview subtitle..."
                      className="!text-sm font-base border-x-0 border-t-0 rounded-none text-main-text placeholder:text-sub-text/50 shadow-none border-b-[1px] px-0 focus-visible:ring-0 focus-visible:border-b-main-text"
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
          </div>

          <div className="mt-2">
            <p className="text-xs-sm text-sub-text">
              The title and subtitle are used on your publication homepage, in
              previews of your story on UnfoldSpace, and on social media.
            </p>
          </div>

          <Button
            className="rounded-full font-light mt-10 mb-[15px] text-sub-text"
            onClick={resetAction}
            variant={"outline"}
            type="button"
          >
            Done
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditorUpdateTitlePopover;
