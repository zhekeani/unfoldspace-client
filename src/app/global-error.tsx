"use client";

import Link from "next/link";

type SearchParams = {
  type?: string;
};

const GlobalError = ({ searchParams }: { searchParams: SearchParams }) => {
  const knownErrors: Record<string, { title: string; message: string }> = {
    "login-failed": {
      title: "Login Failed",
      message:
        "Something went wrong while trying to sign in. Please check your credentials and try again.",
    },
    magicLink: {
      title: "Invalid Magic Link",
      message:
        "This magic link is either expired or invalid. Please request a new one and try again.",
    },
  };

  const errorType = searchParams.type;
  const errorContent = knownErrors[errorType || ""] || {
    title: "Something went wrong",
    message:
      "An unexpected error occurred. Please try again later or return to the home page.",
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[680px]">
        <div className="mx-6">
          <div className="mt-[80px] text-center">
            <p className="text-main-text font-light text-xs-sm">
              ERROR OCCURRED
            </p>
            <div className="mt-2">
              <h2 className="text-8xl text-sub-text font-gt-super">500</h2>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl text-main-text font-gt-super">
                {errorContent.title}
              </h3>
            </div>
            <div className="mt-5">
              <p className="font-sohne font-light text-main-text">
                {errorContent.message}
              </p>
            </div>
            <div className="mt-2 font-sohne font-light underline text-main-text">
              <Link href={"/"}>Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
