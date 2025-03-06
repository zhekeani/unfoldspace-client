"use client";

import { Spinner } from "@/components/loading/Spinner"; // Import Spinner component
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const EmailSignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const prefillEmail = searchParams.get("email") || "";

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: prefillEmail,
    },
  });

  const { trigger, setError, formState } = form;
  const { isSubmitting } = formState; // Track form submission state

  useEffect(() => {
    if (error) {
      setError("email", { message: error, type: "manual" });
      const timer = setTimeout(() => {
        router.replace("/email-signin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router, setError]);

  const formAction = "/api/auth/magic-link";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    const isValid = await trigger();
    if (!isValid) {
      e.preventDefault();
      setIsLoading(false);
    }
    // If valid, the browser will submit the form via its action attribute.
  };

  return (
    <>
      <h3 className="font-gt-super text-3xl font-normal tracking-tighter text-main-text">
        Sign in with email
      </h3>

      <div className="">
        <p className="mt-[30px] text-center text-main-text font-light">
          <span className="text-black text-base">
            Enter the email address associated with <br /> your account, and
            we’ll send a magic link to <br /> your inbox.
          </span>
        </p>
      </div>

      <Form {...form}>
        <form
          ref={formRef}
          method="POST"
          action={formAction}
          onSubmit={onSubmit}
          className="space-y-8 mt-[50px] flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="text-sm font-normal text-main-text">
                  Your email
                </FormLabel>
                <FormControl>
                  <Input
                    size={30}
                    placeholder="email"
                    {...field}
                    disabled={isSubmitting} // Disable input while submitting
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="rounded-full w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="w-4 h-4" /> : "Continue"}
          </Button>
        </form>
      </Form>

      <div className="mt-4">
        <Link
          href="/signin-options"
          className="font-normal text-sm flex gap-1 items-center text-sub-text hover:text-main-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />{" "}
          <span className="font-light">All sign in options</span>
        </Link>
      </div>
    </>
  );
};

export default EmailSignInPage;
