"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import SimpleIcon from "@/components/icons/SimpleIcon";

const SignupOptionsPage = () => {
  return (
    <>
      <h3 className="font-gt-super text-3xl font-normal tracking-tighter text-main-text">
        Join UnfoldSpace
      </h3>

      <div className=" mt-[50px] flex flex-col">
        <div className="flex flex-col gap-3">
          <Link href="/" className="auth-option-link">
            <SimpleIcon.Google className="w-4 h-4" color="black" />
            Sign up with Google
          </Link>
          <Link href="/" className="auth-option-link ">
            <SimpleIcon.Facebook className="w-4 h-4" color="black" />
            Sign up with Facebook
          </Link>
          <Link href="/email-signup" className="auth-option-link ">
            <Mail className="w-4 h-4" color="black" />
            Sign up with Email
          </Link>
        </div>
        <div className="flex gap-1 mt-[40px] mb-[100px] items-center justify-center">
          <p className="text-main-text">Already have an account?</p>{" "}
          <Link
            href="/signin-options"
            className="px-0 text-base text-main-text hover:!bg-transparent hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignupOptionsPage;
