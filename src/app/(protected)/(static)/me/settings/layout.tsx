import MeSettingsSubheader from "@/components/header/protected-header/MeSettingsSubheader";
import SettingsSidebar from "@/components/sidebar/SettingsSidebar";
import SettingsSidebarSkeleton from "@/components/sidebar/skeletons/SettingsSidebarSkeleton";
import MePageSpinner from "@/components/skeleton/MePageSpinner";
import { ReactNode, Suspense } from "react";

const MeSettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="base-wrapper">
      <div className="left-content ">
        <Suspense fallback={<MePageSpinner />}>
          <MeSettingsSubheader />
          {children}
        </Suspense>
      </div>
      <div className="right-content">
        <Suspense fallback={<SettingsSidebarSkeleton />}>
          <SettingsSidebar />
        </Suspense>
      </div>
    </div>
  );
};

export default MeSettingsLayout;
