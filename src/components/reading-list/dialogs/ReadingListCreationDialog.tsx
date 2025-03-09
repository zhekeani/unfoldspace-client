import { createReadingList } from "@/actions/reading-list/createReadingList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StoryBookmarkReadingList } from "../../story/popovers/StoryBookmarkPopover";
import { Textarea } from "../../ui/textarea";

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters long")
    .max(60, "Name must be at most 60 characters long")
    .trim(),

  description: z
    .string()
    .max(280, "Description must be at most 280 characters long")
    .trim()
    .optional(),

  visibility: z.enum(["private", "public"]),
});

type ReadingListCreationDialogProps = {
  children: ReactNode;
  onCreationSuccessCb?: (readingList: StoryBookmarkReadingList) => void;
};

const ReadingListCreationDialog = ({
  children,
  onCreationSuccessCb,
}: ReadingListCreationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      visibility: "public",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState,
    clearErrors,
  } = form;
  const { errors, isValid } = formState;

  const nameValue = watch("name");
  const descriptionValue = watch("description");

  const onClose = () => {
    if (isOpen) {
      reset({ name: "", description: "", visibility: "public" });
    }
    setIsOpen((prev) => !prev);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsCreating(true);
    startTransition(async () => {
      try {
        const response = await createReadingList(
          values.name,
          values.description || null,
          values.visibility
        );

        if (!response.success) {
          toast.error(response.error);
          throw new Error("Failed to create reading list");
        }

        toast.success("Successfully create a new reading list");
        setIsCreating(false);
        if (onCreationSuccessCb) {
          onCreationSuccessCb({
            id: response.data.readingListId,
            title: values.name,
            visibility: values.visibility,
            is_default: false,
            is_saved: false,
          });
        }
        onClose();
      } catch (error) {
        console.error(error);
      } finally {
        setIsCreating(false);
      }
    });
  };

  useEffect(() => {
    clearErrors();
  }, [clearErrors, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className={cn(
          "w-full tablet:max-w-[700px] desktop:max-w-[900px] !tablet:mx-7 !p-0 rounded-none"
        )}
      >
        <div className="tablet:px-14 tablet:py-11 px-[7px] py-8 flex justify-center">
          <div className="w-full tablet:max-w-[400px] max-w-[210px]">
            <DialogTitle className="font-medium text-main-text text-2xl">
              Create new list
            </DialogTitle>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-[60px]">
                {/* Name Input */}
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col pb-5">
                      <FormControl>
                        <Input
                          maxLength={60}
                          placeholder="Give it a name"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <div className="w-full flex justify-between">
                        <div>
                          {!errors.name && (
                            <FormMessage className="mt-1 text-xs font-medium" />
                          )}
                        </div>
                        <p className="text-sm">
                          {nameValue.trim().length}
                          <span className="text-gray-500">/60</span>
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Description Input */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col pb-5">
                      <FormControl>
                        <Textarea
                          rows={2}
                          maxLength={280}
                          placeholder="Description"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <div className="w-full flex justify-between">
                        <div>
                          {errors.description ? (
                            <FormMessage className="mt-1 text-xs font-medium" />
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">
                              Description is optional.
                            </p>
                          )}
                        </div>

                        <p className="text-sm">
                          {descriptionValue
                            ? descriptionValue.trim().length
                            : 0}
                          <span className="text-gray-500">/280</span>
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Visibility Checkbox */}
                <FormField
                  control={control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-row items-center gap-2 ">
                      <FormControl>
                        <Checkbox
                          id="visibility"
                          className="border-main-text"
                          checked={field.value === "private"}
                          onCheckedChange={(checked) =>
                            setValue(
                              "visibility",
                              checked ? "private" : "public"
                            )
                          }
                        />
                      </FormControl>
                      <label
                        htmlFor="visibility"
                        className="text-sm text-main-text leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !mt-0"
                      >
                        Make it private
                      </label>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="mt-[80px] flex justify-center gap-2">
                  <Button
                    onClick={onClose}
                    type="submit"
                    variant="outline"
                    disabled={isPending || isCreating}
                    className="rounded-full text-sub-text border-sub-text font-normal"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isValid || isPending || isCreating}
                    className=" bg-main-green text-white rounded-full font-normal"
                  >
                    {isPending || isCreating ? "Creating..." : "Create List"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingListCreationDialog;
