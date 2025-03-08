import React from "react";

const MeListsReadingHistoryPage = () => {
  return (
    <main className="w-full min-h-fit pt-2 desktop:pt-6 flex flex-col">
      <div style={{ minHeight: "calc(100vh - 400px)" }}>
        <div className="px-6 w-full ">
          <div className="pb-[48px] mb-[18px] border-b-complement-light-gray border-b-[1px] w-full">
            <div className="w-full px-8 py-[72px] flex flex-col items-center bg-gray-100">
              <h4 className="pb-5 text-center ">Coming soon</h4>
              <p className="pb-5 text-center mx-5 text-xs-sm tracking-tight font-light">
                please keep look forward to it.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MeListsReadingHistoryPage;
