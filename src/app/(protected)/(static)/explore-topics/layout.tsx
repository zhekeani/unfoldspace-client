import GeneralSpinner from "@/components/skeleton/GeneralSpinner";
import { ReactNode, Suspense } from "react";

const ExploreTopicsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="base-wrapper">
      <div className="flex-1 min-h-full h-fit">
        <Suspense fallback={<GeneralSpinner />}>{children}</Suspense>
      </div>
    </div>
  );
};

export default ExploreTopicsLayout;
