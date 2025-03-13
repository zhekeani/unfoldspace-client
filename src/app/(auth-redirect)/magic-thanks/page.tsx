import Link from "next/link";

type SearchParams = {
  type?: string;
  email?: string;
};

const MagicThanksPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { email: encodedEmail } = await searchParams;
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : "your email";

  return (
    <div className="text-center">
      <h2 className="text-2xl font-serif">Check your inbox</h2>
      <div className="mt-[30px]">
        <h4>Click the link we sent to {email} to sign in.</h4>
      </div>
      <div className="mt-12">
        <Link
          role="button"
          href={"/"}
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-black/80 hover:text-gray-100"
        >
          Go back
        </Link>
      </div>
    </div>
  );
};

export default MagicThanksPage;
