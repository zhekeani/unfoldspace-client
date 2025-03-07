type PageParams = {
  username: string;
};

const UserHomePage = async ({ params }: { params: Promise<PageParams> }) => {
  const { username } = await params;

  return <div>{username}</div>;
};

export default UserHomePage;
