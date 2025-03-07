import UserLayoutWrapper from "@/components/layout-wrapper/UserLayoutWrapper";
import { ReactNode } from "react";

type PageParams = {
  username: string;
};

const UserLayout = async ({
  params,
  children,
}: {
  params: Promise<PageParams>;
  children: ReactNode;
}) => {
  const { username: encodedUsername } = await params;
  const username = decodeURIComponent(encodedUsername).slice(1);

  return <UserLayoutWrapper username={username}>{children}</UserLayoutWrapper>;
};

export default UserLayout;
