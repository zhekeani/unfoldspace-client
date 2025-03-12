import { publishStory } from "@/actions/story/updateStory";
import { useStoryEditor } from "@/components/context/StoryEditorContext";
import ExtensionKit from "@/components/editor/extensions/story-extension-kit";
import { Spinner } from "@/components/loading/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Story } from "@/types/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnyExtension, generateHTML, JSONContent } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import CoverImageSelector from "./components/CoverImageSelector";
import StoryPublicationDialogTitleDescForm from "./components/StoryPublicationDialogTitleDescForm";
import StoryPublicationTopicsForm from "./components/StoryPublicationTopicsForm";

type StoryPublicationDialogProps = {
  children: ReactNode;
};

const StoryPublicationDialog = ({ children }: StoryPublicationDialogProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const { storyQueryKey, coverImage } = useStoryEditor();
  const queryClient = useQueryClient();

  const story = queryClient.getQueryData<Story | null>(storyQueryKey);

  const { mutate: publishMutation, isPending: isPublishing } = useMutation({
    mutationFn: (story: Story) => {
      const htmlContent = generateHTML(
        story.json_content as JSONContent,
        [...ExtensionKit()].filter((e): e is AnyExtension => e !== undefined)
      );
      return publishStory(story.id, coverImage, htmlContent);
    },

    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Successfully published story.");
        const updatedStory = res.data.story;

        queryClient.setQueryData(storyQueryKey, (oldData?: Story | null) => {
          if (!oldData) return oldData;

          return updatedStory;
        });

        setIsDialogOpen(false);
        router.push(`/%40${updatedStory.author_username}/${updatedStory.id}`);
      }
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" !w-full tablet:!max-w-full desktop-lg:max-h-[80%] h-full overflow-y-scroll !rounded-none desktop-lg:!rounded-sm desktop-lg:items-center tablet:py-[100px] desktop-lg:py-0 tablet:px-0 desktop-lg:px-8 z-[9999] ">
        <DialogTitle className="absolute w-0 h-0 opacity-0 m-0 p-0">
          Publish Story
        </DialogTitle>
        {story && (
          <div className="flex flex-col desktop-lg:flex-row gap-0">
            <div className="desktop-lg:flex-1 desktop-lg:h-[491px] p-10 ">
              <div className="w-full flex flex-col">
                <CoverImageSelector
                  isSelectorOpen={isSelectorOpen}
                  setIsSelectorOpen={setIsSelectorOpen}
                />
              </div>

              {!isSelectorOpen && (
                <div className="mt-4 ">
                  <StoryPublicationDialogTitleDescForm />
                </div>
              )}

              <div className="mt-[10px] mb-5">
                <p className="text-xs-sm text-sub-text/90">
                  <span className="font-medium">Note:</span> Changes here will
                  affect how your story appears in public places like
                  UnfoldSpace&apos;s homepage and in subscribers&apos; inboxes
                  -- not the contents of the story itself.
                </p>
              </div>
            </div>
            <div className="desktop-lg:flex-1 desktop-lg:h-[491px] p-10">
              <p className="mb-[10px] text-lg text-main-text/80 tracking-tight">
                Publishing to: <span className="font-medium">Zhekeani</span>
              </p>

              <div className="mb-6">
                <p className="text-main-text text-sm mb-[10px]">
                  Add or change topics (up to 5) so readers know what your story
                  is about
                </p>

                <StoryPublicationTopicsForm />

                <div className="mt-6">
                  <p className="text-sm text-main-text/80">
                    <a className="underline underline-offset-2">Learn more</a>{" "}
                    about what happens to your post when you publish.
                  </p>
                </div>

                <div className="mt-8">
                  <Button
                    disabled={isPublishing}
                    onClick={() => publishMutation(story)}
                    type="button"
                    className="rounded-full bg-main-green font-normal"
                  >
                    {isPublishing ? <Spinner /> : "Publish now"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryPublicationDialog;
