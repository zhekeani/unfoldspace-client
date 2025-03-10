import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { TextAreaAutosize } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type StoryNoteProps = {
  note?: string;
  storyId: string;
  isOwned: boolean;
};

const formSchema = z.object({
  note: z
    .string()
    .max(500, { message: "Note must be at most 500 characters" })
    .optional(),
});

const ReadingListStoryNote = ({ note, isOwned }: StoryNoteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: note,
    },
  });

  useEffect(() => {
    if (isOwned && note && note.length > 0) {
      setIsOpen(true);
    }
  }, [isOwned, note]);

  const onClose = () => {
    form.reset({ note: note });
    setIsOpen(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  if (!isOwned && !note) return null;

  return (
    <div className="w-full mb-6 flex">
      <div
        className={cn(
          "w-[3px] flex-shrink-0",
          isOpen || (note && note.length > 0)
            ? "bg-main-text"
            : "bg-complement-light-gray"
        )}
      />

      {/* Content */}
      <div className="flex-1 pl-4">
        {isOwned ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <TextAreaAutosize
                        maxLength={500}
                        placeholder={
                          isOpen ? "Write a brief description" : "Add a note..."
                        }
                        style={{ scrollbarWidth: "none" }}
                        className={cn(
                          "text-sm placeholder:italic italic w-full transition-all duration-300 ease-in-out",
                          isOpen ? "min-h-[60px]" : "min-h-[30px]"
                        )}
                        {...field}
                        onFocus={() => setIsOpen(true)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex-[1] flex flex-col items-end tablet:items-start tablet:flex-row-reverse tablet:gap-1">
                {isOpen && (
                  <>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="font-normal text-xs px-2 h-fit w-fit text-main-green"
                    >
                      Done
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="font-normal text-xs px-2 h-fit w-fit text-sub-text"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        ) : (
          <div className="w-full p-3 border border-gray-100 rounded-sm bg-gray-100/50">
            <p className="text-sm italic text-sub-text">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingListStoryNote;
