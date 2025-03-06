"use client";

import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HeaderNewStoryBtn = () => {
  const [randomUuid, setRandomUuid] = useState<string>(crypto.randomUUID());
  const router = useRouter();

  const onMouseEnter = () => {
    setRandomUuid(crypto.randomUUID());
  };

  const onClick = () => {
    router.push(`/editor/${randomUuid}`);
  };

  return (
    <Button
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      variant={"ghost"}
      className="!p-2 text-sub-text hover:text-main-text cursor-pointer"
    >
      <SquarePen className="!w-5 !h-5" strokeWidth={1.5} />
      <span className="text-sm font-normal">Write</span>
    </Button>
  );
};

export default HeaderNewStoryBtn;
