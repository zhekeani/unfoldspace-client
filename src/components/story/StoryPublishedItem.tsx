import { Button } from "@/components/ui/button";
import { fetchStoryByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import calculateReadTime from "@/lib/story/calculateReadTime";
import convertIsoDate from "@/lib/story/convertIsoDate";
import { extractFirstParagraph } from "@/lib/tiptap/extractFirstParagraph";
import { Story } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";
import { Dot, Ellipsis, Share } from "lucide-react";
import Link from "next/link";

type StoryPublishedItemProps = {
  story: Story;
};

const StoryPublishedItem = ({
  story: initialStory,
}: StoryPublishedItemProps) => {
  const { data: story, error: storyError } = useQuery({
    queryKey: ["draft", initialStory.id],
    queryFn: () => fetchStoryByIdOnClient(initialStory.id),
    initialData: initialStory,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (storyError || !story) {
    console.error(storyError);
    return null;
  }

  const firstParagraph = !story.description
    ? extractFirstParagraph(story.json_content as JSONContent)
    : null;

  const contentPreview = story.description
    ? story.description
    : firstParagraph
      ? firstParagraph
      : null;

  return (
    <div className="py-5 border-b-[1px] border-complement-light-gray">
      <div>
        <Link
          href={`/%40${initialStory.author_username}/${initialStory.id}`}
          className="font-medium text-main-text line-clamp-2"
        >
          {story.title}
        </Link>
        {contentPreview && (
          <p className="text-sub-text text-sm mt-2 line-clamp-2">
            {contentPreview}
          </p>
        )}
      </div>
      <div className="flex">
        <div className="w-fit mr-2 mt-2 flex flex-wrap text-xs-sm text-sub-text items-center">
          <p className="whitespace-nowrap">
            Published on {convertIsoDate(story.published_at!)}
          </p>
          <Dot strokeWidth={1} className="text-sub-text mx-1 w-5 h-5" />
          <p className="whitespace-nowrap">
            {calculateReadTime(story.words_count)}
          </p>
        </div>

        <div className="flex items-center">
          <Button size="icon" variant="ghost">
            <Share strokeWidth={1.5} className="text-sub-text" />
          </Button>
          <Button size={"icon"} variant={"ghost"}>
            <Ellipsis strokeWidth={1.5} className="text-sub-text"></Ellipsis>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryPublishedItem;
