"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const formSchema = z.object({
  query: z.string(),
});

const TopicSearch = () => {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    router.push(`/home?tag=${capitalizeFirstLetter(values.query)}`);
  };

  return (
    <div className="h-12 tablet:h-16 flex w-full bg-complement-light-gray rounded-full">
      <Form {...form}>
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="w-full h-full flex"
        >
          <Button
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "h-12 tablet:h-16 w-12 tablet:w-16 rounded-full  transition-colors",
              isFocused ? "text-main-text" : "text-sub-text"
            )}
          >
            <Search className="!w-5 !h-5" strokeWidth={1.5} />
          </Button>
          <FormField
            control={control}
            name="query"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className="flex-1 h-full shadow-none border-none focus-visible:ring-0 placeholder:text-sub-text pl-0"
                    placeholder="Search all topics"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default TopicSearch;
