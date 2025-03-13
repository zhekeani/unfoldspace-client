"use client";

import { Button } from "@/components/ui/button";
import { ExtendedTopic } from "@/types/database.types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type TopicTreeProps = {
  topic: ExtendedTopic;
  adjustParentHeight?: () => void;
};

const InnerTopicTree = ({ topic, adjustParentHeight }: TopicTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sliceIndex = 5;

  useEffect(() => {
    adjustParentHeight?.();
  }, [isExpanded, adjustParentHeight]);

  return (
    <div className="pt-8 pl-6">
      <Link
        href={`/home?tag=${topic.name}`}
        className="text-main-text font-medium text-lg"
      >
        {topic.name}
      </Link>
      <div className="flex flex-col">
        {topic.children
          .slice(0, isExpanded ? topic.children.length : sliceIndex)
          .map((subTopic) => (
            <div
              key={subTopic.id}
              className="pl-4 pt-3 transition-opacity duration-300 ease-in-out opacity-100"
            >
              <Link
                href={`/home?tag=${subTopic.name}`}
                className="text-sub-text"
              >
                {subTopic.name}
              </Link>
            </div>
          ))}
      </div>

      {topic.children.length > sliceIndex && (
        <div className="overflow-hidden transition-all duration-300 ease-in-out mt-3">
          <button
            onClick={() => {
              setIsExpanded((prev) => !prev);
              adjustParentHeight?.();
            }}
            className="underline pl-4 text-sub-text hover:text-main-text transition-colors flex items-center gap-1"
          >
            {isExpanded ? (
              <ChevronUp strokeWidth={1.5} className="w-4 h-4" />
            ) : (
              <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
            )}
            {isExpanded ? "Show less" : "More"}
          </button>
        </div>
      )}
    </div>
  );
};

const TopicTree = ({ topic }: TopicTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  // Function to adjust parent height
  const adjustParentHeight = () => {
    requestAnimationFrame(() => {
      if (contentRef.current) {
        setMaxHeight(
          isExpanded ? `${contentRef.current.scrollHeight}px` : "0px"
        );
      }
    });
  };

  useEffect(() => {
    adjustParentHeight();
  }, [isExpanded]);

  return (
    <div className="pb-8">
      <Link
        href={`/home?tag=${topic.name}`}
        className="text-main-text text-2xl font-medium"
      >
        {topic.name}
      </Link>
      {topic.children.slice(0, 3).map((subTopic) => (
        <InnerTopicTree
          topic={subTopic}
          key={subTopic.id}
          adjustParentHeight={adjustParentHeight}
        />
      ))}

      {topic.children.length > 4 && (
        <>
          <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight }}
          >
            {topic.children.slice(3).map((subTopic) => (
              <InnerTopicTree
                topic={subTopic}
                key={subTopic.id}
                adjustParentHeight={adjustParentHeight}
              />
            ))}
          </div>

          <Button
            onClick={() => {
              setIsExpanded((prev) => !prev);
              adjustParentHeight();
            }}
            variant={"ghost"}
            className="bg-transparent hover:bg-transparent px-0 text-main-green !text-base mt-6 pl-3 flex items-center gap-1 font-normal"
          >
            {isExpanded ? (
              <ChevronUp strokeWidth={1.5} />
            ) : (
              <ChevronDown strokeWidth={1.5} />
            )}
            Show all in &quot;{topic.name}&quot;
          </Button>
        </>
      )}
    </div>
  );
};

export default TopicTree;
