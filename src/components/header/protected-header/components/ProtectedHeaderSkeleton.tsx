import { Skeleton } from "@/components/ui/skeleton";

const ProtectedHeaderSkeleton = () => {
  return (
    <header className="w-full flex flex-shrink-0 h-[57px] px-6 border-b-gray-200 border-b-[1px]">
      <nav className="w-full h-full flex justify-between items-center">
        {/* Left Section */}
        <div className="h-full flex items-center">
          <Skeleton className="w-36 h-7 rounded-md" />{" "}
          {/* Simulating UnfoldSpace logo */}
          <div className="ml-4 hidden mobile:flex rounded-full bg-gray-100 px-2 items-center">
            <Skeleton className="w-8 h-8 rounded-full" />{" "}
            {/* Simulating Search Button */}
            <Skeleton className="w-40 h-8 rounded-full ml-2" />{" "}
            {/* Simulating Search Input */}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex h-full items-center gap-3">
          <Skeleton className="w-28 h-9 rounded-full" />{" "}
          {/* Simulating "New Story" button */}
          <Skeleton className="w-8 h-8 rounded-full mobile:hidden" />{" "}
          {/* Mobile Search Button */}
          <Skeleton className="w-8 h-8 rounded-full" /> {/* Bell Icon */}
          <Skeleton className="w-10 h-10 rounded-full" />{" "}
          {/* User Profile Dropdown */}
        </div>
      </nav>
    </header>
  );
};

export default ProtectedHeaderSkeleton;
