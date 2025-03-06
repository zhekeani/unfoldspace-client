import { Skeleton } from "@/components/ui/skeleton";
import SideBarSubsectionWrapper from "./SidebarSubsectionWrapper";

const MainSidebarSkeleton = () => {
  return (
    <div className="w-[303px]">
      {/* Staff Picks Section */}
      <SideBarSubsectionWrapper heading="Staff Picks">
        <div className="flex flex-col gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-5 w-3/4 rounded" /> {/* Story Title */}
              <Skeleton className="h-4 w-1/2 rounded" /> {/* Author */}
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-28 mt-2 rounded" />{" "}
        {/* "See full list" link */}
      </SideBarSubsectionWrapper>

      {/* Advice Banner Section */}
      <SideBarSubsectionWrapper>
        <div className="bg-blue-100 relative p-[22px] rounded-md">
          <Skeleton className="h-5 w-40 mb-3 rounded" /> {/* Title */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <Skeleton className="h-8 w-24 mt-4 rounded-full" /> {/* Button */}
        </div>
      </SideBarSubsectionWrapper>

      {/* Recommended Topics Section */}
      <SideBarSubsectionWrapper heading="Recommended topics">
        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-4 w-28 mt-2 rounded" />{" "}
        {/* "See more topics" link */}
      </SideBarSubsectionWrapper>

      {/* Lastly Saved Stories Section */}
      <SideBarSubsectionWrapper heading="Lastly saved">
        <div className="mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-5 w-3/4 rounded" /> {/* Story Title */}
              <Skeleton className="h-4 w-1/2 rounded" /> {/* Author */}
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-28 mt-2 rounded" /> {/* "See all" link */}
      </SideBarSubsectionWrapper>

      {/* Footer Section */}
      <Skeleton className="h-10 w-full mt-6 rounded" />
    </div>
  );
};

export default MainSidebarSkeleton;
