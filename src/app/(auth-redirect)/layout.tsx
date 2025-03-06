import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const AuthRedirectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-svh">
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 border shadow-lg rounded-sm",
          "w-full h-svh max-w-full flex flex-col items-center justify-center rounded-none",
          "tablet:max-w-[600px] desktop:max-w-[678px] desktop:max-h-[695px]",
          "px-14 pt-[120px] pb-11 tablet:pb-[120px]"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthRedirectLayout;
