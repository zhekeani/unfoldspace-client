import { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full min-h-svh h-svh flex flex-col">{children}</div>;
};

export default ProtectedLayout;
