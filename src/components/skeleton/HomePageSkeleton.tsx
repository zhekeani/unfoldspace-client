const HomePageSkeleton = () => {
  return (
    <main className="w-full min-h-screen pt-2 desktop:pt-6 flex flex-col">
      {/* Skeleton for Topics Carousel */}
      <div className="h-[53px] max-h-[53px] flex items-center mx-6 gap-3 w-full">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 flex gap-2">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
        </div>
      </div>

      {/* Skeleton for Stories Container */}
      <div className="flex-1 flex flex-col gap-6 px-6 pt-10">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="h-[150px] border-b-[1px] border-muted-gray-200 animate-pulse"
            >
              <div className="flex gap-2 items-center mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div className="w-32 h-4 bg-gray-200 rounded" />
              </div>
              <div className="w-full h-6 bg-gray-200 rounded mb-2" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
            </div>
          ))}
      </div>

      {/* Skeleton for Pagination */}
      <div className="my-6 flex justify-center">
        <div className="w-48 h-10 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </main>
  );
};

export default HomePageSkeleton;
