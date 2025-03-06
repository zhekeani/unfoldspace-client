"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import SimpleIcon from "../../../components/icons/SimpleIcon";

const SigninOptionsPage = () => {
  // const supabase = getSupabaseBrowserClient();

  const handleGoogleOAuth = () => {
    // if (supabase) {
    //   supabase.auth.signInWithOAuth({
    //     provider: "google",
    //     options: {
    //       redirectTo: window.location.origin + "/api/auth/verify-oauth",
    //       queryParams: {
    //         access_type: "offline",
    //         prompt: "consent",
    //       },
    //     },
    //   });
    // }
  };

  return (
    <>
      <h3 className="font-gt-super text-3xl font-normal tracking-tighter text-main-text">
        Welcome back.
      </h3>

      <div className=" mt-[50px] flex flex-col">
        <div className="flex flex-col gap-3">
          <button onClick={handleGoogleOAuth} className="auth-option-link ">
            <SimpleIcon.Google className="w-4 h-4" color="black" />
            Sign in with Google
          </button>
          <Link href="/" className="auth-option-link ">
            <SimpleIcon.Facebook className="w-4 h-4" color="black" />
            Sign in with Facebook
          </Link>
          <Link href="/" className="auth-option-link ">
            <SimpleIcon.X className="w-4 h-4" color="black" />
            Sign in with X
          </Link>
          <Link href="/email-signin" className="auth-option-link ">
            <Mail className="w-4 h-4" color="black" />
            Sign in with Email
          </Link>
        </div>
        <div className="flex gap-1 mt-[40px] mb-16 items-center justify-center">
          <p className="font-light">No account?</p>{" "}
          <Link
            href="/signup-options"
            className="px-0 text-base text-main-text hover:!bg-transparent hover:underline font-medium"
          >
            Create one
          </Link>
        </div>

        <div className=" mb-8">
          <p className="text-xs text-main-text font-light">
            Forgot email or trouble singing in?{" "}
            <span>
              <Link href={"/"} className="underline text-main-text">
                Get help
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SigninOptionsPage;
