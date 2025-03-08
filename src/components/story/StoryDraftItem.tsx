"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchDraftByIdOnClient } from "@/lib/component-fetches/story/fetchStoriesClient";
import calculateReadTime, { timeAgo } from "@/lib/story/calculateReadTime";
import { extractFirstParagraph } from "@/lib/tiptap/extractFirstParagraph";
import { Story } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";
import { ChevronDown, Dot } from "lucide-react";
import Link from "next/link";

export type StoryDraft = Pick<
  Story,
  | "id"
  | "user_id"
  | "title"
  | "description"
  | "json_content"
  | "words_count"
  | "updated_at"
  | "created_at"
>;

type StoryDraftItemProps = {
  draft: StoryDraft;
};

const StoryDraftItem = ({ draft: initialDraft }: StoryDraftItemProps) => {
  const { data: draft, error: draftError } = useQuery({
    queryKey: ["draft", initialDraft.id],
    queryFn: () => fetchDraftByIdOnClient(initialDraft.id),
    initialData: initialDraft,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (draftError || !draft) {
    console.error(draftError);
    return null;
  }

  const firstParagraph = !draft.description
    ? extractFirstParagraph(draft.json_content as JSONContent)
    : null;

  const contentPreview = draft.description
    ? draft.description
    : firstParagraph
      ? firstParagraph
      : null;

  return (
    <div className="py-5 border-b-[1px] border-complement-light-gray">
      <div>
        <Link
          href={`/editor/${draft.id}`}
          className="font-medium text-main-text line-clamp-2"
        >
          {draft.title}
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
            Last edited {timeAgo(draft.updated_at)}
          </p>
          <Dot strokeWidth={1} className="text-sub-text mx-1 w-5 h-5" />
          <p className="whitespace-nowrap">
            {calculateReadTime(draft.words_count)} ({draft.words_count} words)
            so far
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost">
              <ChevronDown strokeWidth={2} className="text-sub-text" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1">
            <div className="flex flex-col items-start  text-xs-sm">
              <Link
                href={`/editor/${draft.id}`}
                className="w-full justify-start inline-flex items-center  gap-2 whitespace-nowrap rounded-md  transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-sub-text"
              >
                Edit draft
              </Link>
              {/* <DraftDeleteDialog
                isDeleting={isDeleting}
                isPending={isPending}
                handleDelete={handleDelete}
              /> */}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default StoryDraftItem;
