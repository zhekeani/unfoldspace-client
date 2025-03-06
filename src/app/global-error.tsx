"use client";

import Link from "next/link";
import { useEffect } from "react";

type SearchParams = {
  type?: string;
};

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

const GlobalError = ({
  error,
  reset,
  searchParams,
}: {
  error: Error;
  reset: () => void;
  searchParams: SearchParams;
}) => {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  // Check if there's a known type in searchParams, otherwise use the thrown error
  const errorType = searchParams.type;
  const errorContent = knownErrors[errorType || ""] || {
    title: "Something went wrong",
    message: error?.message || "An unexpected error occurred.",
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
            <div className="mt-5 flex gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                Try Again
              </button>
              <Link href="/" className="px-4 py-2 rounded bg-gray-300">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
