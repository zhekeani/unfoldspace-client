import MainLayoutWrapper from "@/components/layout-wrapper/MainLayoutWrapper";
import { ReactNode } from "react";

const ProtectedHomeLayout = ({ children }: { children: ReactNode }) => {
  return <MainLayoutWrapper>{children}</MainLayoutWrapper>;
};

export default ProtectedHomeLayout;
