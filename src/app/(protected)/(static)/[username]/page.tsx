import { redirect } from "next/navigation";

type PageParams = {
  username: string;
};

const UserPage = async ({ params }: { params: Promise<PageParams> }) => {
  const { username } = await params;
  redirect(`/${username}/home`);

  return null;
};

export default UserPage;
