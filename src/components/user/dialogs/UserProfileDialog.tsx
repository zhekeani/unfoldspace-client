import { updateUserProfile } from "@/actions/user/updateUserProfile";
import { useSettingAccount } from "@/components/context/SettingAccountContext";
import { Spinner } from "@/components/loading/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ServiceUser } from "@/types/database.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SettingsDialogContentContainer from "./components/SettingsDialogCotentContainer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const formSchema = z.object({
  avatar: z
    .custom<File>((file) => file instanceof File || file === undefined, {
      message: "Invalid file type.",
    })
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Image size must be 5MB or less.",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPEG, PNG, or WebP images are allowed.",
    }),
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(50, { message: "Name must be at most 50 characters." }),
  pronouns: z
    .string()
    .max(4, { message: "Pronouns must be at most 4 characters." })
    .optional(),
  shortBio: z
    .string()
    .max(160, { message: "Short bio must be at most 160 characters." })
    .optional(),
});

const UserProfileDialog = ({ children }: { children: ReactNode }) => {
  const { user, userQueryKey, invalidateUser } = useSettingAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.profile_picture
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      pronouns: user.pronouns || "",
      shortBio: user.short_bio || "",
    },
  });
  const { handleSubmit, control, reset, watch, setError, formState } = form;
  const { isValid } = formState;

  const nameValue = watch("name");
  const pronounsValue = watch("pronouns");
  const shortBioValue = watch("shortBio");

  const isProfileChanged = previewUrl !== user.profile_picture;

  const { mutate: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      updateUserProfile(
        values.name,
        values.pronouns,
        values.shortBio,
        values.avatar || null
      ),

    onSuccess: (res, values) => {
      if (!res.success) {
        if (res.error.includes("name")) {
          setError("name", { type: "manual", message: res.error });
        } else {
          setServerError(res.error);
        }
        toast.error(res.error);
      } else {
        toast.success("Successfully updated profile");

        if (isProfileChanged) {
          router.refresh();
        }

        queryClient.setQueryData(
          userQueryKey,
          (oldData?: { serviceUser: ServiceUser }) => {
            if (!oldData) return oldData;

            return {
              serviceUser: {
                ...oldData.serviceUser,
                name: values.name,
                profile_picture: values.avatar,
                short_bio: values.shortBio,
                pronouns: values.pronouns,
              },
            };
          }
        );

        invalidateUser();
        setIsOpen(false);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateMutation(values);
  };

  const onClose = () => {
    if (isOpen) {
      reset({
        name: user.name,
        pronouns: user.pronouns || "",
        shortBio: user.short_bio || "",
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleAvatarChange = (file?: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <SettingsDialogContentContainer heading="Profile information">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <FormField
                control={control}
                name="avatar"
                render={({ field: { onChange, ref } }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-main-text">
                      Photo
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-6 pt-[10px]">
                        <div className="relative w-20 h-20">
                          {/* Avatar Preview */}
                          <Avatar className="absolute top-0 left-0 pointer-events-none w-20 h-20">
                            <AvatarImage
                              className="h-full w-full object-cover"
                              src={previewUrl || ""}
                            />
                            <AvatarFallback className="text-2xl">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {/* Hidden File Input */}
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            className="w-20 h-20 rounded-full opacity-0 absolute"
                            ref={(el) => {
                              ref(el);
                              fileInputRef.current = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleAvatarChange(file);
                              onChange(file);
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4">
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="p-1 font-normal text-main-green"
                            >
                              Update
                            </Button>
                            <Button
                              variant="ghost"
                              type="button"
                              className="p-1 font-normal text-destructive"
                            >
                              Remove
                            </Button>
                          </div>

                          <FormDescription className="text-sm">
                            Recommended Square JPG or PNG, at least 1,000 pixels
                            per side.
                          </FormDescription>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-main-text">
                      Name*
                    </FormLabel>
                    <FormControl>
                      <Input maxLength={50} {...field} />
                    </FormControl>
                    <div className="flex justify-between">
                      <div>
                        <FormMessage />
                        {!form.formState.errors.name && (
                          <FormDescription>
                            Name is at least 5 characters.
                          </FormDescription>
                        )}
                      </div>
                      <div className="w-fit flex-shrink-0 text-sm">
                        {nameValue.trim().length}
                        <span className="text-gray-500">/50</span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="pronouns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-main-text">
                      Pronouns
                    </FormLabel>
                    <FormControl>
                      <Input maxLength={4} {...field} />
                    </FormControl>
                    <div className="flex justify-between">
                      <div>
                        <FormMessage />
                      </div>
                      <div className="w-fit flex-shrink-0 text-sm">
                        {pronounsValue ? pronounsValue.trim().length : 0}
                        <span className="text-gray-500">/4</span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="shortBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-main-text">
                      Short bio
                    </FormLabel>
                    <FormControl>
                      <Textarea maxLength={160} {...field} />
                    </FormControl>
                    <div className="flex justify-between">
                      <div>
                        <FormMessage />
                      </div>
                      <div className="w-fit flex-shrink-0 text-sm">
                        {shortBioValue ? shortBioValue.trim().length : 0}
                        <span className="text-gray-500">/160</span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {serverError && (
              <p className="text-destructive text-sm mt-4">{serverError}</p>
            )}

            <div className="w-full h-[1px] my-8 bg-gray-200"></div>

            <Link href={`/%40${user.username}/about`} className="flex">
              <div className="flex-1 flex flex-col gap-2">
                <h5 className="text-sm text-main-text">About Page</h5>
                <p className="text-xs text-sub-text">
                  Personalize with images and more to paint more of a vivid
                  portrait of yourself than your &quot;Short bio.&quot;
                </p>
              </div>
              <div className="w-[44px] flex-shrink-0 flex justify-end items-start">
                <ExternalLink
                  strokeWidth={1.5}
                  size={20}
                  className="stroke-sub-text"
                />
              </div>
            </Link>

            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="rounded-full border-main-green text-main-green"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isUpdating}
                className="rounded-full bg-main-green "
              >
                {isUpdating ? <Spinner /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </SettingsDialogContentContainer>
    </Dialog>
  );
};

export default UserProfileDialog;
