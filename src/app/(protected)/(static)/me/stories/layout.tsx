import MeStoriesSubheader from "@/components/header/protected-header/MeStoriesSubheader";
import MainSidebar from "@/components/sidebar/MainSidebar";
import MainSidebarSkeleton from "@/components/sidebar/skeletons/MainSidebarSkeleton";
import MePageSpinner from "@/components/skeleton/MePageSpinner";
import { ReactNode, Suspense } from "react";

const MeStoriesLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="base-wrapper">
      <div className="left-content min-h-[800px]">
        <MeStoriesSubheader />
        <Suspense fallback={<MePageSpinner />}>{children}</Suspense>
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
