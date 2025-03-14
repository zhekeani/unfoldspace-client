import { useStoryEditor } from "@/components/context/StoryEditorContext";
import { Button } from "@/components/ui/button";
import { extractImageUrlsFromJSONContent } from "@/lib/editor/utils/extractImages";
import { cn } from "@/lib/utils";
import { Story } from "@/types/database.types";
import { useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/react";

type CoverImageSelectorProps = {
  isSelectorOpen: boolean;
  setIsSelectorOpen: (isOpen: boolean) => void;
};

const CoverImageSelector = ({
  isSelectorOpen,
  setIsSelectorOpen,
}: CoverImageSelectorProps) => {
  const { storyQueryKey, coverImage, setCoverImage } = useStoryEditor();
  const queryClient = useQueryClient();

  const story = queryClient.getQueryData<Story | null>(storyQueryKey);
  const images = story
    ? extractImageUrlsFromJSONContent(story.json_content as JSONContent)
    : [];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-medium mb-2 text-main-text/80 tracking-tight">
        Story Preview
      </p>

      {isSelectorOpen ? (
        <div className="bg-gray-100 pt-4 rounded-sm">
          <Button
            size="sm"
            className="mb-3 font-normal mx-5"
            variant="outline"
            onClick={() => setIsSelectorOpen(false)}
          >
            Done
          </Button>
          <div className="grid grid-cols-3 px-5 pb-4 gap-2 h-[300px] overflow-y-scroll">
            {images.length > 0 ? (
              images.map((imageUrl) => (
                <div
                  key={imageUrl}
                  className={cn(
                    "cursor-pointer p-1 border h-fit rounded-md",
                    coverImage === imageUrl
                      ? "border-blue-500"
                      : "border-gray-300"
                  )}
                  onClick={() => setCoverImage(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-[100px] aspect-square object-cover rounded-md"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No images available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative h-[200px] w-full overflow-hidden">
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt="Selected Preview"
                className="object-cover w-full h-full"
              />

              <Button
                onClick={() => setIsSelectorOpen(true)}
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-normal rounded-full bg-black/70 border-[1px] border-white"
              >
                Change preview image
              </Button>
            </>
          ) : (
            <div className="w-full h-full rounded-md border-[1px] border-complement-light-gray flex items-center justify-center flex-col text-sub-text text-center">
              <p className="text-sm">There is no image detected</p>
              <p className="text-xs mt-2 text-sub-text/70">
                Your story&apos;s images will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoverImageSelector;
