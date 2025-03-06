import { Skeleton } from "../../ui/skeleton";

const PublicAuthPageSkeleton = () => {
  return (
    <div className="flex flex-col items-center text-center w-full">
      {/* Simulated Heading */}
      <Skeleton className="h-8 w-3/4 max-w-[250px] mb-6" />

      {/* Simulated Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[300px]">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Simulated Divider */}
      <Skeleton className="h-[1px] w-3/4 my-6" />

      {/* Simulated Small Text */}
      <Skeleton className="h-4 w-1/2 max-w-[200px] mb-6" />
      <Skeleton className="h-4 w-1/3 max-w-[150px]" />
    </div>
  );
};

export default PublicAuthPageSkeleton;
