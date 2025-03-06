"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { gtSuper, sohne, sourceSerif } from "./fonts/fonts";

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

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("type");

  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  const errorContent = knownErrors[errorType || ""] || {
    title: "Something went wrong",
    message: error?.message || "An unexpected error occurred.",
  };

  return (
    <div
      className={`w-full flex justify-center ${sohne.variable} ${sourceSerif.variable} ${gtSuper.variable}`}
    >
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
              <Button onClick={() => reset()} className="">
                Try Again
              </Button>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Link href="/" className="">
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
