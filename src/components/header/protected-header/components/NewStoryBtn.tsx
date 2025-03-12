"use client";

import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import Link from "next/link";

const HeaderNewStoryBtn = () => {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
      }}
      variant={"ghost"}
      className="!p-2 text-sub-text hover:text-main-text cursor-pointer"
    >
      <Link href={"/editor"} className="flex gap-2 items-center">
        <SquarePen className="!w-5 !h-5" strokeWidth={1.5} />
        <span className="text-sm font-normal">Write</span>
      </Link>
    </Button>
  );
};

export default HeaderNewStoryBtn;
