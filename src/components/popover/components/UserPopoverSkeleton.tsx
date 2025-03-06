import { Skeleton } from "@/components/ui/skeleton";

const UserPopoverSkeleton = () => {
  return (
    <>
      <div className="flex justify-between items-end">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="w-20 h-8 rounded-full" />
      </div>

      <div className="mt-3">
        <Skeleton className="w-32 h-4 rounded" />
        <Skeleton className="w-20 h-3 rounded mt-2" />
      </div>

      <div className="mt-3">
        <Skeleton className="w-full h-3 rounded" />
        <Skeleton className="w-3/4 h-3 rounded mt-1" />
      </div>
    </>
  );
};

export default UserPopoverSkeleton;
