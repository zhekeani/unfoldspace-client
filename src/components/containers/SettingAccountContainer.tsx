"use client";

import {
  SettingAccountProvider,
  useSettingAccount,
} from "@/components/context/SettingAccountContext";
import { ServiceUser } from "@/types/database.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserAccDeletionAlertDialog from "../user/dialogs/UserAccDeletionAlertDialog";
import UserDeactivateAccAlertDialog from "../user/dialogs/UserDeactivateAccAlertDialog";
import UserEmailDialog from "../user/dialogs/UserEmailDialog";
import UserProfileDialog from "../user/dialogs/UserProfileDialog";
import UserUsernameDialog from "../user/dialogs/UserUsernameDialog";

type SettingAccountContainerProps = {
  user: ServiceUser;
};

const InnerSettingAccountContainer = ({}: SettingAccountContainerProps) => {
  const { user } = useSettingAccount();

  return (
    <div className="w-full px-6 pt-2">
      <div className="flex flex-col gap-5 ">
        <UserEmailDialog>
          <div className="w-full flex justify-between py-2">
            <h5 className="font-normal text-sm">Email address</h5>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </UserEmailDialog>
        <UserUsernameDialog>
          <div className="w-full flex justify-between py-2">
            <h5 className="font-normal text-sm">Username</h5>
            <p className="text-gray-500 text-sm">{user.username}</p>
          </div>
        </UserUsernameDialog>

        <UserProfileDialog>
          <div className="w-full flex justify-between items-center py-2">
            <div className="flex flex-col items-start gap-1">
              <h5 className="font-normal text-sm">Username</h5>
              <p className="text-gray-500 text-xs">
                Edit your photo, name, pronouns, short bio, etc.
              </p>
            </div>

            <div className="flex gap-2">
              <p className="text-gray-500 text-sm">{user.name}</p>

              <Avatar className="w-6 h-6">
                {user.profile_picture && (
                  <AvatarImage
                    className="w-full h-full object-cover"
                    src={user.profile_picture}
                  />
                )}
                <AvatarFallback className="text-xs">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </UserProfileDialog>
      </div>
      <div className="my-8 w-full h-[1px] bg-gray-200" />
      <div>
        <div className="w-full flex justify-between">
          <div>
            <h5 className="font-normal text-sm">
              Muted writers and publications
            </h5>
          </div>
          <div className="w-[44px] flex-shrink-0 flex justify-end items-start">
            <ExternalLink
              strokeWidth={1.5}
              size={20}
              className="stroke-sub-text"
            />
          </div>
        </div>
      </div>

      <div className="my-8 w-full h-[1px] bg-gray-200" />

      <div className="flex flex-col gap-8">
        <UserDeactivateAccAlertDialog>
          <div className="flex flex-col items-start gap-1">
            <h5 className="font-normal text-sm text-destructive">
              Deactivate account
            </h5>
            <p className="text-gray-500 text-xs">
              Deactivating will suspend your account until you sign back in.
            </p>
          </div>
        </UserDeactivateAccAlertDialog>

        <UserAccDeletionAlertDialog>
          <div className="flex flex-col items-start gap-1">
            <h5 className="font-normal text-sm text-destructive">
              Delete account
            </h5>
            <p className="text-gray-500 text-xs">
              Permanently delete your account and all of your content.
            </p>
          </div>
        </UserAccDeletionAlertDialog>
      </div>
    </div>
  );
};

const SettingAccountContainer = (props: SettingAccountContainerProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SettingAccountProvider initialUser={props.user}>
        <InnerSettingAccountContainer {...props} />
      </SettingAccountProvider>
    </QueryClientProvider>
  );
};

export default SettingAccountContainer;
