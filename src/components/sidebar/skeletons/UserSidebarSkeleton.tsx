import SidebarFooter from "@/components/sidebar/components/SidebarFooter";
import SideBarSubsectionWrapper from "@/components/sidebar/components/SidebarSubsectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";

const UserSidebarSkeleton = () => {
  return (
    <div className="w-[303px] flex flex-col justify-between">
      <div className="mt-10">
        {/* Profile Section Skeleton */}
        <div className="flex flex-col items-center">
          <Skeleton className="w-[88px] h-[88px] rounded-full" />
          <Skeleton className="mt-3 w-24 h-4 rounded" />
          <Skeleton className="mt-2 w-16 h-3 rounded" />
          <Skeleton className="mt-3 w-48 h-3 rounded" />
          <Skeleton className="mt-1 w-40 h-3 rounded" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="w-20 h-8 rounded-full" />
            <Skeleton className="w-10 h-8 rounded-full" />
          </div>
        </div>

        {/* Reading Lists Skeleton */}
        <SideBarSubsectionWrapper heading="Lists">
          <div className="flex flex-col gap-4 mb-4">
            <Skeleton className="w-full h-5 rounded" />
            <Skeleton className="w-full h-5 rounded" />
            <Skeleton className="w-full h-5 rounded" />
          </div>
          <Skeleton className="w-20 h-3 rounded" />
        </SideBarSubsectionWrapper>
      </div>

      {/* Footer */}
      <SidebarFooter />
    </div>
  );
};

export default UserSidebarSkeleton;
