"use client";

import { Carousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UrlObject } from "url";
import {
  AutosizeCarouselContent,
  AutosizeCarouselItem,
  AutosizeCarouselNext,
  AutosizeCarouselPrevious,
} from "./AutosizeCarousel";
import { useAutosizeCarousel } from "./hooks/UseAutosizeCarousel";

export type SubsectionTab = {
  label: string;
  path: string | UrlObject;
};

type SubsectionTabsCarouselProps = {
  subsectionTabs: SubsectionTab[];
};

const SubsectionTabsCarousel = ({
  subsectionTabs,
}: SubsectionTabsCarouselProps) => {
  const pathname = usePathname();
  const { isLastItemVisible } = useAutosizeCarousel(
    subsectionTabs.map((tab) => tab.label)
  );

  return (
    <Carousel
      opts={{ align: "start", slidesToScroll: 1 }}
      className="max-w-full"
    >
      <AutosizeCarouselContent className="w-0">
        {subsectionTabs.map((tab, index) => (
          <AutosizeCarouselItem
            key={index}
            style={{ flex: `0 0 auto` }}
            className={cn("h-[53px] pt-4")}
            data-last-item={
              index === subsectionTabs.length - 1 ? "true" : undefined
            }
          >
            <div className="relative h-full">
              <Link href={tab.path}>
                <p
                  className={cn(
                    "truncate text-sm text-center text-sub-text",
                    pathname === tab.path && "text-main-text"
                  )}
                >
                  {tab.label}
                </p>
              </Link>
              {pathname === tab.path && (
                <div className="absolute h-[1px] w-full bg-main-text bottom-0" />
              )}
            </div>
          </AutosizeCarouselItem>
        ))}
      </AutosizeCarouselContent>

      <AutosizeCarouselPrevious />
      {!isLastItemVisible && <AutosizeCarouselNext />}

      <div className="absolute w-full h-[1px] bg-main-text/10 bottom-0 left-0" />
    </Carousel>
  );
};

export default SubsectionTabsCarousel;
