"use client";

import {
  PopoverButton,
  PopoverGroup,
} from "@/components/popover/components/ExtendedPopover";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sanitizeTopic } from "@/lib/story/sanitizeTopic";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Compass, MoveUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  query: z.string(),
});

const HeaderTopicSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    router.push(`/home?tag=${sanitizeTopic(values.query)}`);
  };

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsFocused(true);
  };

  return (
    <div className="relative">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="ml-4 hidden mobile:flex rounded-full bg-gray-100 px-2 items-center"
        >
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Search
              className={cn(
                "transition-colors",
                isFocused ? "stroke-main-text" : "stroke-sub-text"
              )}
              strokeWidth={1.5}
            />
          </Button>
          <FormField
            control={control}
            name="query"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Search"
                    className="rounded-full shadow-none border-none focus-visible:ring-0 font-light"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {isFocused && (
        <div
          className="w-[300px] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-white rounded-none shadow-md"
          onMouseEnter={() => clearTimeout(timeoutRef.current!)}
        >
          <PopoverGroup className="w-full">
            <PopoverButton className="w-full">
              <Link
                href={"/explore-topics"}
                className="flex justify-between items-center w-full"
              >
                <div className="flex gap-3 items-center">
                  <Compass
                    strokeWidth={1}
                    className="!w-5 !h-5 stroke-sub-text"
                  />
                  <p className="text-sub-text font-light">Explore topics</p>
                </div>
                <MoveUpRight
                  strokeWidth={1}
                  className="!w-4 !h-4 stroke-sub-text"
                />
              </Link>
            </PopoverButton>
          </PopoverGroup>
        </div>
      )}
    </div>
  );
};

export default HeaderTopicSearch;
