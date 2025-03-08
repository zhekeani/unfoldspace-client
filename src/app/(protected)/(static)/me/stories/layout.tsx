import MeStoriesSubheader from "@/components/header/protected-header/MeStoriesSubheader";
import MainSidebar from "@/components/sidebar/MainSidebar";
import MainSidebarSkeleton from "@/components/sidebar/skeletons/MainSidebarSkeleton";
import { ReactNode, Suspense } from "react";

const MeStoriesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="base-wrapper">
      <div className="left-content min-h-[800px]">
        <MeStoriesSubheader />
        {children}
      </div>
      <div className="right-content">
        <Suspense fallback={<MainSidebarSkeleton />}>
          <MainSidebar />
        </Suspense>
      </div>
    </div>
  );
};

export default MeStoriesLayout;
