import { updateUserEmail } from "@/actions/user/updateUserEmail";
import { useSettingAccount } from "@/components/context/SettingAccountContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { ReactNode, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsDialogContentContainer from "./components/SettingsDialogCotentContainer";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const UserEmailDialog = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { user } = useSettingAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: user.email },
    mode: "onChange",
  });

  const { handleSubmit, control, watch, formState, reset, setError } = form;
  const { errors, isValid } = formState;
  const emailValue = watch("email");

  const isUnchanged = emailValue === user.email;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const origin = window.location.origin;

      const response = await updateUserEmail(values.email, origin);

      if (!response.success) {
        setError("email", { type: "manual", message: response.error });
        return;
      }

      toast.success("A verification email has been sent.", {
        description: `Please check your ${values.email} inbox.`,
      });

      reset({ email: values.email });
      setIsOpen(false);
    });
  };

  const onClose = () => {
    if (isOpen) {
      reset({ email: user.email });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <SettingsDialogContentContainer heading="Email address">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center"
          >
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormControl>
                    <Input
                      placeholder="email"
                      className="w-full"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <div>
                    <FormMessage className="mt-1 text-xs font-normal">
                      {errors.email?.message}
                    </FormMessage>
                    {!errors.email && (
                      <p className="text-xs text-gray-500 mt-1">
                        You can sign into UnfoldSpace with this email address.
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <div className="flex bg-yellow-100 px-3 py-3 rounded-md border border-yellow-300">
              <div className="flex-1 flex flex-col gap-1">
                <h5 className="text-xs-sm font-medium text-yellow-800 flex items-center gap-2">
                  <CircleAlert className="w-4 h-4 stroke-yellow-800" />
                  <span>Important: Email Verification Required</span>
                </h5>
                <p className="text-xs text-yellow-800">
                  Your email will <strong>not be updated immediately</strong>. A
                  confirmation email will be sent to your
                  <strong> new email address</strong>. Please verify it to
                  complete the update.
                </p>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <div className="flex gap-4 mt-12 mobile:mt-0">
                <Button
                  variant="outline"
                  className="border-main-green text-main-green rounded-full font-normal hover:text-main-green/80"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-full w-fit bg-main-green hover:bg-main-green/70"
                  type="submit"
                  disabled={!isValid || isUnchanged || isPending}
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SettingsDialogContentContainer>
    </Dialog>
  );
};

export default UserEmailDialog;
