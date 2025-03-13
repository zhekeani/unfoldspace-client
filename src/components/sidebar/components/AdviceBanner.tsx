"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SideBarSubsectionWrapper from "./SidebarSubsectionWrapper";

const SidebarAdviceBanner = () => {
  const [isAdviceShown, setIsAdviceShown] = useState(true);

  if (!isAdviceShown) {
    return null;
  }

  return (
    <SideBarSubsectionWrapper>
      <div className="bg-blue-100 relative p-[22px]">
        <Button
          onClick={() => setIsAdviceShown(false)}
          className="absolute top-0 right-0 text-sub-text"
          variant="ghost"
          size="icon"
        >
          <X />
        </Button>

        <h4 className="text-base font-semibold">Writing in UnfoldSpace</h4>
        <div className="mt-3 flex flex-col gap-1">
          <Link href="/" className="font-medium text-sm">
            New writer FAQ
          </Link>
          <Link href="/" className="font-medium text-sm">
            Expert writing advice
          </Link>
          <Link href="/" className="font-medium text-sm">
            Grow your readership
          </Link>
        </div>
        <Button size={"sm"} className="mt-6 rounded-full text-xs font-normal">
          <Link href={`/editor`}>Start writing</Link>
        </Button>
      </div>
    </SideBarSubsectionWrapper>
  );
};

export default SidebarAdviceBanner;
