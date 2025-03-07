import MainLayoutWrapper from "@/components/layout-wrapper/MainLayoutWrapper";
import { ReactNode, Suspense } from "react";
import HomePageSkeleton from "@/components/skeleton/HomePageSkeleton";

const ProtectedHomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <MainLayoutWrapper>
      <Suspense fallback={<HomePageSkeleton />}>{children}</Suspense>
    </MainLayoutWrapper>
  );
};

export default ProtectedHomeLayout;
