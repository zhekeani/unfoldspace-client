import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchActiveUserOnServer } from "@/lib/component-fetches/service-user/fetchUserServer";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import HeaderNewStoryBtn from "./components/NewStoryBtn";
import HeaderUserDropdown from "./components/UserDropdown";

const ProtectedHeader = async () => {
  const response = await fetchActiveUserOnServer();

  if (!response) {
    return null;
  }
  const { serviceUser } = response;

  return (
    <header className="w-full flex flex-shrink-0 h-[57px] px-6 border-b-gray-200 border-b-[1px]">
      <nav className="w-full h-full flex justify-between items-center">
        <div className="h-full flex items-center">
          <Link
            href={"/home"}
            className="font-gt-super text-3xl font-medium tracking-tighter"
          >
            UnfoldSpace
          </Link>
          <div className="ml-4 hidden mobile:flex rounded-full bg-gray-100 px-2 items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="text-sub-text" strokeWidth={1.5} />
            </Button>

            <Input
              type="text"
              placeholder="Search"
              className="rounded-full shadow-none border-none  focus-visible:ring-0 font-light"
            />
          </div>
        </div>

        <div className="flex h-full items-center gap-3">
          <div className="hidden tablet:block">
            <HeaderNewStoryBtn />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="mobile:hidden rounded-full"
          >
            <Search className="text-sub-text" />
          </Button>

          <Button size="icon" variant="ghost">
            <Bell strokeWidth={1.5} className="text-sub-text !w-5 !h-5" />
          </Button>
          <HeaderUserDropdown serviceUser={serviceUser} />
        </div>
      </nav>
    </header>
  );
};

export default ProtectedHeader;
