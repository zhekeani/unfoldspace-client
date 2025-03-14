"use client";

import useUserStateChange from "@/components/header/hooks/useUserStateChange";
import {
  PopoverButton,
  PopoverDivider,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { ServiceUser } from "@/types/database.types";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, useState } from "react";
import { settingLinks, userLinks } from "../constant/links";

type HeaderUserDropdownProps = {
  serviceUser: ServiceUser;
};

const HeaderUserDropdown = ({ serviceUser }: HeaderUserDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useUserStateChange();

  const pathname = usePathname();

  const logout = (e: MouseEvent<HTMLAnchorElement>) => {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      e.preventDefault();
      supabase.auth.signOut();
    }
  };

  return (
    <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <PopoverTrigger className="rounded-full cursor-pointer">
        <Avatar className="h-8 w-8">
          <AvatarImage
            className="w-full h-full object-cover"
            src={serviceUser?.profile_picture || ""}
          />
          <AvatarFallback>
            {serviceUser.username.slice(0, 2).toUpperCase() || "ZZ"}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className="!w-[264px] text-sub-text rounded-none"
      >
        <PopoverGroup className="py-3 px-1">
          <PopoverButton
            asChild
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(false);
            }}
          >
            <Link
              href={`/%40${serviceUser?.username}`}
              className="flex items-center w-full justify-start text-sub-text hover:text-main-text group"
            >
              <UserRound
                className="!w-5 !h-5 group-hover:stroke-main-text"
                strokeWidth={pathname.startsWith("/%40") ? 1.5 : 1}
              />
              <span
                className={cn(
                  "pl-4",
                  pathname.startsWith("/%40") && "text-main-text"
                )}
              >
                Profile
              </span>
            </Link>
          </PopoverButton>
          {userLinks.map((userLink) => (
            <PopoverButton
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
              key={userLink.label}
              asChild
            >
              <Link
                href={userLink.href}
                className="flex items-center w-full justify-start px-2 py-1 text-sub-text hover:text-main-text group"
              >
                <userLink.icon
                  className="!w-5 !h-5 group-hover:stroke-main-text"
                  strokeWidth={
                    pathname.startsWith(userLink.parentRoute) ? 1.5 : 1
                  }
                />
                <span
                  className={cn(
                    "pl-4",
                    pathname.startsWith(userLink.parentRoute) &&
                      "text-main-text"
                  )}
                >
                  {userLink.label}
                </span>
              </Link>
            </PopoverButton>
          ))}
        </PopoverGroup>
        <PopoverDivider />
        <PopoverGroup className="py-3 px-1">
          {settingLinks.map((settingLink) => (
            <PopoverButton
              key={settingLink.label}
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
              }}
              asChild
            >
              <Link
                href={settingLink.href}
                className="w-full justify-start px-2 py-1 text-sub-text hover:text-main-text "
              >
                <span className="">{settingLink.label}</span>
              </Link>
            </PopoverButton>
          ))}
        </PopoverGroup>
        <PopoverDivider />
        <PopoverGroup className="py-5 px-1">
          <PopoverButton
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="py-3"
            asChild
          >
            <Link
              role="button"
              href="/api/auth/logout"
              onClick={logout}
              className="w-full justify-start  cursor-pointer text-sub-text hover:text-main-text px-4 py-1"
            >
              <div className="flex flex-col leading-3 gap-3">
                <span className="font-medium">Sign out</span>
                <span className="font-normal">{serviceUser?.email}</span>
              </div>
            </Link>
          </PopoverButton>
        </PopoverGroup>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderUserDropdown;
