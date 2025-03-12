import { updateStory } from "@/actions/story/updateStory";
import { Story } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const titleDescriptionSchema = z.object({
  previewTitle: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title must be at most 100 characters long")
    .trim(),

  previewSubtitle: z
    .string()
    .min(10, "Subtitle must be at least 10 characters long")
    .max(300, "Subtitle must be at most 300 characters long")
    .trim(),
});

const useTitleDescForm = (
  story: Story | null,
  queryClient: QueryClient,
  storyQueryKey: string[]
) => {
  const form = useForm<z.infer<typeof titleDescriptionSchema>>({
    resolver: zodResolver(titleDescriptionSchema),
    defaultValues: {
      previewTitle: story ? story.title : "",
      previewSubtitle: story ? story.description || "" : "",
    },
    mode: "onChange",
  });

  const { watch } = form;
  const previewTitle = watch("previewTitle");
  const previewSubtitle = watch("previewSubtitle");

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (args: {
      storyId: string;
      values: z.infer<typeof titleDescriptionSchema>;
    }) =>
      updateStory(args.storyId, {
        title: args.values.previewTitle,
        description: args.values.previewSubtitle,
      }),

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully update title & description.");

        queryClient.setQueryData(storyQueryKey, (oldData?: Story | null) => {
          if (!oldData) return oldData;

          const updatedStory = res.data.story;
          return updatedStory;
        });

        queryClient.invalidateQueries({ queryKey: storyQueryKey });
      }
    },
  });

  const debouncedSubmit = useRef(
    _.debounce(async (values: z.infer<typeof titleDescriptionSchema>) => {
      if (
        story &&
        form.formState.isValid &&
        (values.previewTitle !== story?.title ||
          values.previewSubtitle !== story.description) &&
        !isUpdating
      ) {
        updateMutation({ storyId: story.id, values });

        console.log("Submitting updated values:", values);
      } else {
        console.log("No changes detected, skipping submit.");
      }
    }, 500)
  ).current;

  useEffect(() => {
    debouncedSubmit(form.getValues());
  }, [debouncedSubmit, form, previewTitle, previewSubtitle]);

  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  return { form, debouncedSubmit };
};

export default useTitleDescForm;
