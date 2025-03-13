import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReactNode, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import SettingsDialogContentContainer from "./components/SettingsDialogCotentContainer";

type AlertDialogProps = {
  children: ReactNode;
};

const UserAccDeletionAlertDialog = ({ children }: AlertDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: { confirm: "" },
  });

  const confirmValue = useWatch({ control: form.control, name: "confirm" });

  const isConfirmValid = confirmValue === "delete";

  const onSubmit = (values: { confirm: string }) => {
    console.log(values);
  };

  const onClose = () => {
    if (isOpen) {
      form.reset();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger>{children}</DialogTrigger>
      <SettingsDialogContentContainer heading="Delete account">
        <div>
          <p className="text-sm text-gray-800">
            We&apos;re sorry to see you go. Once your account is deleted, all of
            your content will be permanently gone, including your profile,
            stories, notes, and responses.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormLabel className="text-sm font-normal text-gray-800">
                    To confirm deletion, type &quot;delete&quot; below.
                  </FormLabel>
                  <FormControl>
                    <Input
                      maxLength={30}
                      type="text"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>

                  <div className="h-5">
                    {!isConfirmValid && confirmValue.length > 0 && (
                      <FormMessage className="text-xs font-medium">
                        The value must be exactly &quot;delete&quot;.
                      </FormMessage>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </form>
          <div className="mt-8 flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-full border-destructive text-destructive"
            >
              Cancel
            </Button>
            <Button
              disabled={!isConfirmValid}
              type="submit"
              className="rounded-full bg-destructive"
            >
              Delete account
            </Button>
          </div>
        </Form>
      </SettingsDialogContentContainer>
    </Dialog>
  );
};

export default UserAccDeletionAlertDialog;
