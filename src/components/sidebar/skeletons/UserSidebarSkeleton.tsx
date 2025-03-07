import SidebarFooter from "@/components/sidebar/components/SidebarFooter";
import SideBarSubsectionWrapper from "@/components/sidebar/components/SidebarSubsectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";

const UserSidebarSkeleton = () => {
  return (
    <div className="w-full desktop:w-[303px] flex desktop:flex-col justify-between">
      <div className="mt-10 w-full desktop:w-fit">
        {/* Profile Section Skeleton */}
        <div className="flex justify-between w-full desktop:block">
          <div className="flex desktop:block gap-4">
            <Skeleton className="w-12 h-12 desktop:w-[88px] desktop:h-[88px] rounded-full" />
            <div>
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="mt-2 w-16 h-3 rounded" />
            </div>
            <div className="hidden desktop:block mt-3">
              <Skeleton className="w-48 h-3 rounded" />
              <Skeleton className="mt-1 w-40 h-3 rounded" />
            </div>
          </div>
          <div className="desktop:mt-4 flex gap-2">
            <Skeleton className="w-20 h-8 rounded-full" />
            <Skeleton className="w-10 h-8 rounded-full" />
          </div>
        </div>

        {/* Reading Lists Skeleton */}
        <div className="hidden desktop:block">
          <SideBarSubsectionWrapper heading="Lists">
            <div className="flex flex-col gap-4 mb-4">
              <Skeleton className="w-full h-5 rounded" />
              <Skeleton className="w-full h-5 rounded" />
              <Skeleton className="w-full h-5 rounded" />
            </div>
            <Skeleton className="w-20 h-3 rounded" />
          </SideBarSubsectionWrapper>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden desktop:block">
        <SidebarFooter />
      </div>
    </div>
  );
};

export default UserSidebarSkeleton;
