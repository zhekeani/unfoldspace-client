import { Skeleton } from "@/components/ui/skeleton";

const UserHomePageSkeleton = () => {
  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 260px)" }}>
        {/* Stories List Skeleton */}
        <div className="flex flex-col gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[120px] flex flex-col mx-6 border-b-[1px] border-muted-gray-200"
            >
              <div className="flex gap-2 mb-4 items-center">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-24 h-4 rounded" />
              </div>
              <div className="flex flex-row">
                <div className="flex-1">
                  <Skeleton className="w-full h-6 rounded" />
                  <Skeleton className="mt-2 w-3/4 h-4 rounded" />
                </div>
                <Skeleton className="hidden tablet:block w-[160px] h-[107px] ml-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="my-6 flex justify-center">
        <Skeleton className="w-40 h-8 rounded" />
      </div>
    </main>
  );
};

export default UserHomePageSkeleton;
