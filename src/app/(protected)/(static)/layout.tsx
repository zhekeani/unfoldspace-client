import { ReactNode, Suspense } from "react";
import ProtectedHeader from "../../../components/header/protected-header/ProtectedHeader";
import ProtectedHeaderSkeleton from "../../../components/header/protected-header/components/ProtectedHeaderSkeleton";

const StaticLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Suspense fallback={<ProtectedHeaderSkeleton />}>
        <ProtectedHeader />
      </Suspense>
      {children}
    </>
  );
};

export default StaticLayout;
