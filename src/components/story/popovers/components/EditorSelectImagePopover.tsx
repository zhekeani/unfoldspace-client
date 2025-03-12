import { extractImageUrlsFromJSONContent } from "@/components/../lib/editor/utils/extractImages";
import { cn } from "@/components/../lib/utils";
import { Story } from "@/components/../types/database.types";
import { useStoryEditor } from "@/components/context/StoryEditorContext";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";

type EditorSelectImagePopoverProps = {
  resetAction: () => void;
};

const EditorSelectImagePopover = ({
  resetAction,
}: EditorSelectImagePopoverProps) => {
  const queryClient = useQueryClient();
  const { storyQueryKey, setCoverImage, coverImage } = useStoryEditor();

  const story = queryClient.getQueryData<Story | null>(storyQueryKey);
  const images = story
    ? extractImageUrlsFromJSONContent(story.json_content as JSONContent)
    : [];

  return (
    <div className="p-[14px] w-[400px]">
      <div>
        <div>
          <div className="mt-[15px] text-sm text-sub-text">
            <p>
              {images.length > 0
                ? "Select one of your images to feature"
                : "Tip: add a high-quality image to your story to capture people's interest"}
            </p>
          </div>
          <div className="my-3">
            {images.length > 0 && (
              <div className="flex flex-wrap">
                {images.map((image) => (
                  <div
                    key={image}
                    className={cn(
                      "cursor-pointer p-[2px] border h-fit rounded-none",
                      coverImage === image
                        ? "border-blue-500"
                        : "border-gray-300"
                    )}
                    onClick={() => setCoverImage(image)}
                  >
                    <img
                      src={image}
                      alt="Preview"
                      className="w-[60px] h-[60px] aspect-square object-cover rounded-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t-[1px] border-t-gray-100">
          <div className="mt-[20px] ">
            <Button
              className="rounded-full font-light"
              onClick={resetAction}
              variant={"outline"}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSelectImagePopover;
