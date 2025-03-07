"use client";

import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Topic } from "@/types/database.types";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  AutosizeCarouselContent,
  AutosizeCarouselItem,
  AutosizeCarouselNext,
  AutosizeCarouselPrevious,
} from "./AutosizeCarousel";
import { useAutosizeCarousel } from "./hooks/UseAutosizeCarousel";

export type TopicCarouselProps = {
  activeTopic?: string;
  topics: Pick<Topic, "id" | "name">[];
};

const TopicsCarousel = ({
  activeTopic = "For you",
  topics,
}: TopicCarouselProps) => {
  const { isLastItemVisible } = useAutosizeCarousel(
    topics.map((topic) => topic.name)
  );

  return (
    <div className="h-[53px] max-h-[53px] flex items-center mx-6 gap-3 w-full ">
      <Button variant="ghost" size="icon" className=" flex-shrink-0">
        <Plus strokeWidth={2} />
      </Button>
      <Carousel
        opts={{ align: "start", slidesToScroll: 1 }}
        style={{ width: "calc(100% - 96px)" }}
        className="max-w-full "
      >
        <AutosizeCarouselContent className="w-0 ">
          <AutosizeCarouselItem
            style={{ flex: `0 0 auto` }}
            className={cn("h-[53px] pt-4")}
            data-last-item={undefined}
          >
            <div className="relative h-full">
              <Link
                href={{
                  pathname: "/home",
                }}
              >
                <p
                  className={cn(
                    "truncate text-sm text-center text-sub-text",
                    activeTopic === "For you" && "text-main-text"
                  )}
                >
                  For you
                </p>
              </Link>
              {activeTopic === "For you" && (
                <div className="absolute h-[1px] w-full bg-main-text bottom-0" />
              )}
            </div>
          </AutosizeCarouselItem>
          {topics.map((topic, index) => (
            <AutosizeCarouselItem
              key={index}
              style={{ flex: `0 0 auto` }}
              className={cn("h-[53px] pt-4")}
              data-last-item={index === topics.length - 1 ? "true" : undefined}
            >
              <div className="relative h-full">
                <Link
                  href={{
                    pathname: "/home",
                    query: { tag: topic.name },
                  }}
                >
                  <p
                    className={cn(
                      "truncate text-sm text-center text-sub-text",
                      activeTopic === topic.name && "text-main-text"
                    )}
                  >
                    {topic.name}
                  </p>
                </Link>
                {activeTopic === topic.name && (
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
    </div>
  );
};

export default TopicsCarousel;
