"use client";

import { deletePublishedStory } from "@/actions/story/deleteStory";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";
import { ChevronDown, Dot } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  PopoverButton,
  PopoverGroup,
} from "../popover/components/ExtendedPopover";
import StoryDeletionAlertDialog from "./dialogs/StoryDeletionAlertDialog";

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
  draftsQueryKey: string[];
};

const StoryDraftItem = ({
  draft: initialDraft,
  draftsQueryKey,
}: StoryDraftItemProps) => {
  const queryClient = useQueryClient();
  const { data: draft, error: draftError } = useQuery({
    queryKey: ["draft", initialDraft.id],
    queryFn: () => fetchDraftByIdOnClient(initialDraft.id),
    initialData: initialDraft,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePublishedStory(initialDraft.id),
    onMutate: () => {
      queryClient.setQueryData(
        draftsQueryKey,
        (oldData?: { drafts: StoryDraft[] }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            drafts: oldData.drafts.filter(
              (draft) => draft.id !== initialDraft.id
            ),
          };
        }
      );
    },
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully deleted draft");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: draftsQueryKey });
    },
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
          href={`/editor?storyId=${draft.id}`}
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
          <PopoverContent>
            <div className="flex flex-col items-start ">
              <PopoverGroup>
                <PopoverButton>
                  <Link href={`/editor?storyId=${draft.id}`}>Edit draft</Link>
                </PopoverButton>
                <StoryDeletionAlertDialog
                  isDeleting={isDeleting}
                  handleDelete={deleteMutation}
                >
                  <PopoverButton variant="danger">Delete draft</PopoverButton>
                </StoryDeletionAlertDialog>
              </PopoverGroup>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default StoryDraftItem;
