import UserSidebarSkeleton from "@/components/sidebar/skeletons/UserSidebarSkeleton";
import { cn } from "@/lib/utils";
import { ReactNode, Suspense } from "react";

type UserLayoutWrapperProps = {
  children: ReactNode;
  username: string;
};

const UserLayoutWrapper = async ({ children }: UserLayoutWrapperProps) => {
  return (
    <div className="w-full flex-1 max-w-[1336px] mx-auto flex desktop:flex-row justify-evenly items-center desktop:items-start flex-col-reverse">
      <div className="left-content">{children}</div>
      <div
        className={cn(
          "desktop:flex desktop:w-[351px] desktop:min-w-[351px] desktop:min-h-full h-fit desktop:pr-6 desktop:justify-end desktop:border-l-[1px] desktop:border-l-black/10 desktop:flex-none desktop:pl-0",
          "flex-1 max-w-[728px] w-full h-fit bg-blue-200 px-6"
        )}
      >
        <Suspense fallback={<UserSidebarSkeleton />}>
          {/* <UserSidebar username={username} /> */}
        </Suspense>
      </div>
    </div>
  );
};

export default UserLayoutWrapper;
