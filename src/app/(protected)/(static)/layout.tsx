import ProtectedHeader from "@/components/header/protected-header/ProtectedHeader";
import ProtectedHeaderSkeleton from "@/components/header/protected-header/components/ProtectedHeaderSkeleton";
import PageSpinner from "@/components/loading/PageSpinner";
import { ReactNode, Suspense } from "react";

const StaticLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Suspense fallback={<ProtectedHeaderSkeleton />}>
        <ProtectedHeader />
      </Suspense>
      <Suspense fallback={<PageSpinner />}>{children}</Suspense>
    </>
  );
};

export default StaticLayout;
