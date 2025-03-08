import MeListsSubheader from "@/components/header/protected-header/MeListsSubheader";
import MainSidebar from "@/components/sidebar/MainSidebar";
import MainSidebarSkeleton from "@/components/sidebar/skeletons/MainSidebarSkeleton";
import { ReactNode, Suspense } from "react";

const MeListsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="base-wrapper">
      <div className="left-content min-h-[800px]">
        <MeListsSubheader />
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

export default MeListsLayout;
