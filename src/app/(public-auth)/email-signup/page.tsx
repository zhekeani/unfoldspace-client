"use client";

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
import { Spinner } from "../../../components/loading/Spinner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const EmailSignUpPage = () => {
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
  const { trigger, setError } = form;

  useEffect(() => {
    if (error) {
      setError("email", { message: error, type: "manual" });

      const timer = setTimeout(() => {
        router.replace("/email-signup");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router, setError]);

  const formAction = "/api/auth/register";

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
        Sign up with email
      </h3>

      <div className="">
        <p className="mt-[30px] text-center text-main-text font-light">
          <span className="text-black text-base">
            Enter your email address to create an <br /> account
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
                  <Input size={30} placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="rounded-full w-full"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="w-4 h-4" /> : "Continue"}
          </Button>
        </form>
      </Form>

      <div className="mt-4">
        <Link
          href="/signup-options"
          className="font-normal text-sm flex gap-1 items-center text-sub-text hover:text-main-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />{" "}
          <span className="font-light">All sign up options</span>
        </Link>
      </div>
    </>
  );
};

export default EmailSignUpPage;
