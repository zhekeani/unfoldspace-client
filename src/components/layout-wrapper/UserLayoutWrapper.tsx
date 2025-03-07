import UserSidebar from "@/components/sidebar/UserSidebar";
import { ReactNode } from "react";

type UserLayoutWrapperProps = {
  children: ReactNode;
  username: string;
};

const UserLayoutWrapper = ({ children, username }: UserLayoutWrapperProps) => {
  return (
    <div className="base-wrapper">
      <div className="left-content">{children}</div>
      <div className="right-content">
        <UserSidebar username={username} />
      </div>
    </div>
  );
};

export default UserLayoutWrapper;
