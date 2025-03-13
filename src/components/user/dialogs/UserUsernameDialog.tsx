import { updateUsername } from "@/actions/user/updateUsername";
import { useSettingAccount } from "@/components/context/SettingAccountContext";
import { Spinner } from "@/components/loading/Spinner";
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
import { ServiceUser } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsDialogContentContainer from "./components/SettingsDialogCotentContainer";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must be at most 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Only letters, numbers, and underscores are allowed.",
    }),
});

const UserUsernameDialog = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { user, userQueryKey, invalidateUser } = useSettingAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
    },
    mode: "onChange",
  });

  const { handleSubmit, control, reset, watch, setError, formState } = form;
  const { errors, isValid } = formState;
  const usernameValue = watch("username");

  const isUnchanged = usernameValue === user.username;

  const letterCount = usernameValue.trim().length;

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (username: string) => updateUsername(username),

    onSuccess: (res, username) => {
      if (!res.success) {
        toast.error(res.error);
        setError("username", { type: "manual", message: res.error });
      } else {
        toast.success("Successfully updated username");

        queryClient.setQueryData(
          userQueryKey,
          (oldData?: { serviceUser: ServiceUser }) => {
            if (!oldData) return oldData;

            return {
              serviceUser: {
                ...oldData.serviceUser,
                username: username,
              },
            };
          }
        );

        setIsOpen(false);
      }
    },

    onSettled: () => {
      invalidateUser();
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation(values.username);
  };

  const onClose = () => {
    if (isOpen) {
      reset({
        username: user.username,
      });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger className="w-full flex justify-between py-2">
        {children}
      </DialogTrigger>
      <SettingsDialogContentContainer heading="Username">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-center"
          >
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <FormControl>
                    <Input
                      maxLength={30}
                      placeholder="Username"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>

                  <div>
                    <FormMessage className="mt-1 text-xs font-medium" />
                    {!errors.username && (
                      <div className="w-full flex justify-between">
                        <p className="text-xs text-gray-500 mt-1">
                          Your public username on UnfoldSpace.
                        </p>

                        <p className="text-sm">
                          {letterCount}
                          <span className="text-gray-500">/30</span>
                        </p>
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <div className="flex gap-4 mt-12 mobile:mt-0">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-main-green text-main-green rounded-full font-normal"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-full w-fit bg-main-green"
                  type="submit"
                  disabled={!isValid || isUnchanged || isUpdating}
                >
                  {isUpdating ? <Spinner /> : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SettingsDialogContentContainer>
    </Dialog>
  );
};

export default UserUsernameDialog;
