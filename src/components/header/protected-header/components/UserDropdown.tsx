"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const pathname = usePathname();

  const logout = (e: MouseEvent<HTMLAnchorElement>) => {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      e.preventDefault();
      supabase.auth.signOut();
    }
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage
            className="w-full h-full object-cover"
            src={serviceUser?.profile_picture || ""}
          />
          <AvatarFallback>
            {serviceUser.username.slice(0, 2).toUpperCase() || "ZZ"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="!w-[264px] text-sub-text">
        <DropdownMenuLabel className="text-main-text font-medium">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="py-3 px-1">
          <DropdownMenuItem
            onClick={() => setIsDropdownOpen(false)}
            className={cn(pathname.startsWith("/%40") && "text-main-text ")}
          >
            <Link
              href={`/%40${serviceUser?.username}`}
              className="flex items-center w-full px-2 py-1 text-sub-text hover:text-main-text group"
            >
              <UserRound
                className="!w-5 !h-5 group-hover:stroke-main-text"
                strokeWidth={pathname.startsWith("/%40") ? 1.5 : 1}
              />
              <span className="pl-4">Profile</span>
            </Link>
          </DropdownMenuItem>
          {userLinks.map((userLink) => (
            <DropdownMenuItem
              onClick={() => setIsDropdownOpen(false)}
              key={userLink.label}
              className={cn(
                pathname.startsWith(userLink.parentRoute) && "text-main-text"
              )}
            >
              <Link
                href={userLink.href}
                className="flex items-center w-full px-2 py-1 text-sub-text hover:text-main-text group"
              >
                <userLink.icon
                  className="!w-5 !h-5 group-hover:stroke-main-text"
                  strokeWidth={
                    pathname.startsWith(userLink.parentRoute) ? 1.5 : 1
                  }
                />
                <span className="pl-4">{userLink.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="py-3 px-1">
          {settingLinks.map((settingLink) => (
            <DropdownMenuItem
              key={settingLink.label}
              onClick={() => setIsDropdownOpen(false)}
              className=""
            >
              <Link
                href={settingLink.href}
                className="w-full px-2 py-1 text-sub-text hover:text-main-text "
              >
                <span className="">{settingLink.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="py-3 px-1">
          <DropdownMenuItem className="py-3" asChild>
            <Link
              role="button"
              href="/api/auth/logout"
              onClick={logout}
              className="w-full  cursor-pointer text-sub-text hover:text-main-text px-4 py-1"
            >
              <div className="flex flex-col leading-3 gap-3">
                <span className="font-medium">Sign out</span>
                <span className="font-normal">{serviceUser?.email}</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserDropdown;
