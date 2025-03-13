import { Skeleton } from "@/components/ui/skeleton";

const SettingsSidebarSkeleton = () => {
  return (
    <div className="w-[303px] flex flex-col justify-between">
      <div>
        {/* Skeleton for the heading */}
        <div className="mb-3">
          <Skeleton className="w-3/4 h-4" />
        </div>

        {/* Skeletons for the article links */}
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="w-full h-5" />
          ))}
        </div>
      </div>

      {/* Skeleton for the footer */}
      <div className="mt-6">
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  );
};

export default SettingsSidebarSkeleton;
