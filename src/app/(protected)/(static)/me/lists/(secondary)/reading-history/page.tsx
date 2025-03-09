import React from "react";

const MeListsReadingHistoryPage = () => {
  return (
    <>
      <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
        <div style={{ minHeight: "calc(100vh - 400px)" }}>
          <div className="px-6 w-full">
            <div className="pb-12 mb-6 border-b border-gray-200 w-full">
              <div className="w-full px-8 py-16 flex flex-col items-center  rounded-md">
                <h4 className="text-lg font-medium text-gray-900">
                  Coming Soon
                </h4>
                <p className="mt-2 text-center text-sm text-gray-600">
                  This feature is currently in development. Stay tuned for
                  updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MeListsReadingHistoryPage;
