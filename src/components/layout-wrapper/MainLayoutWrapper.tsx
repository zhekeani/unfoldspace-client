import { ReactNode, Suspense } from "react";

import MainSidebar from "../sidebar/MainSidebar";
import MainSidebarSkeleton from "@/components/sidebar/skeletons/MainSidebarSkeleton";

type MainLayoutWrapperProps = {
  children: ReactNode;
};

const MainLayoutWrapper = ({ children }: MainLayoutWrapperProps) => {
  return (
    <div className="base-wrapper">
      <div className="left-content">{children}</div>
      <div className="right-content">
        <Suspense fallback={<MainSidebarSkeleton />}>
          <MainSidebar />
        </Suspense>
      </div>
    </div>
  );
};

export default MainLayoutWrapper;
