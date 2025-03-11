import { updateListItemNote } from "@/actions/reading-list-item/updateListItem";
import { Spinner } from "@/components/loading/Spinner";
import { ExtendedReadingListItem } from "@/components/reading-list/ReadingListStoryItem";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { TextAreaAutosize } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type StoryNoteProps = {
  note?: string;
  listItemId: string;
  listItemQueryKey: string[];
  isOwned: boolean;
};

const formSchema = z.object({
  note: z
    .string()
    .max(500, { message: "Note must be at most 500 characters" })
    .optional(),
});

const ReadingListStoryNote = ({
  note: initialNote,
  isOwned,
  listItemId,
  listItemQueryKey,
}: StoryNoteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: initialNote,
    },
  });

  const onClose = () => {
    form.reset({ note: initialNote });
    setIsOpen(false);
  };

  const { mutate: updateNoteMutation, isPending: isUpdatingNote } = useMutation(
    {
      mutationFn: (noteValue: string | null) =>
        updateListItemNote(listItemId, noteValue),

      onSuccess: (res, noteValue) => {
        if (!res.success) {
          toast.error(res.error);
        } else {
          toast.success("Successfully updated list item note");

          queryClient.setQueryData(
            listItemQueryKey,
            (oldData?: { listItem: ExtendedReadingListItem }) => {
              if (!oldData || !oldData.listItem) return oldData;

              return {
                listItem: {
                  ...oldData.listItem,
                  note: noteValue,
                },
              };
            }
          );
          setIsOpen(false);
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: listItemQueryKey });
      },
    }
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateNoteMutation(values.note || null);
  };

  if (!isOwned && !initialNote) return null;

  return (
    <div className="w-full mb-6 flex">
      <div
        className={cn(
          "w-[3px] flex-shrink-0",
          isOpen || (initialNote && initialNote.length > 0)
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
                  <FormItem className="w-full relative">
                    <FormControl>
                      <TextAreaAutosize
                        maxLength={500}
                        placeholder={
                          isOpen ? "Write a brief description" : "Add a note..."
                        }
                        style={{ scrollbarWidth: "none" }}
                        className={cn(
                          "text-sm resize-none shadow-none rounded-[2px]  placeholder:italic italic w-full transition-all duration-300 ease-in-out",
                          isOpen
                            ? "min-h-[60px] bg-complement-light-gray/50"
                            : "min-h-[30px] bg-complement-light-gray"
                        )}
                        {...field}
                        onFocus={() => setIsOpen(true)}
                      />
                    </FormControl>

                    {isUpdatingNote && (
                      <>
                        <div className="absolute w-full h-full bg-gray-300/70 " />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <Spinner />
                        </div>
                      </>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex-[1] flex flex-col items-end tablet:items-start tablet:flex-row-reverse tablet:gap-1">
                {isOpen && (
                  <>
                    <Button
                      disabled={isUpdatingNote}
                      type="submit"
                      variant="ghost"
                      className="font-normal text-xs px-2 h-fit w-fit text-main-green"
                    >
                      Done
                    </Button>
                    <Button
                      disabled={isUpdatingNote}
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
            <p className="text-sm italic text-sub-text">{initialNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingListStoryNote;
