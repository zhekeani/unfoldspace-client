import UserSidebar from "@/components/sidebar/UserSidebar";
import { ReactNode, Suspense } from "react";
import UserSidebarSkeleton from "../sidebar/skeletons/UserSidebarSkeleton";

type UserLayoutWrapperProps = {
  children: ReactNode;
  username: string;
};

const UserLayoutWrapper = ({ children, username }: UserLayoutWrapperProps) => {
  return (
    <div className="base-wrapper">
      <div className="left-content">{children}</div>
      <div className="right-content">
        <Suspense fallback={<UserSidebarSkeleton />}>
          <UserSidebar username={username} />
        </Suspense>
      </div>
    </div>
  );
};

export default UserLayoutWrapper;
