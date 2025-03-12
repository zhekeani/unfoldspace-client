import { ChangeEvent, DragEvent, useCallback } from "react";

import { EditorButton } from "@/components/editor/components/ui/EditorButton";
import { LucideIcon } from "@/components/icons/LucideIcon";
import { Spinner } from "@/components/loading/Spinner";
import { cn } from "@/lib/utils";
import { useDropZone, useFileUpload, useUploader } from "./hooks";
import { useStoryEditor } from "@/components/context/StoryEditorContext";

export const ImageUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const { uploadFile, loading } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
    uploader: uploadFile,
  });
  const { storyId } = useStoryEditor();
  const isDisabled = !storyId;

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // console.log(e.target.files);
      if (!e.target.files) {
        return null;
      }

      return uploadFile(e.target.files[0]);
    },
    [uploadFile]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
        <Spinner className="text-neutral-700" size={1.5} />
      </div>
    );
  }

  const wrapperClass = cn(
    "flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80 border-2 border-dashed border-gray-400",
    draggedInside && "bg-neutral-100 border-none"
  );

  return (
    <div
      className={wrapperClass}
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        onDrop(e);
      }}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
    >
      <LucideIcon
        name="Image"
        className="w-12 h-12 mb-4 text-black dark:text-white opacity-20"
      />
      <div className="font-sans flex flex-col items-center justify-center gap-2">
        <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
          {isDisabled
            ? "Please wait a sec.."
            : draggedInside
              ? "Drop image here"
              : "Drag and drop or"}
        </div>
        <div>
          <EditorButton
            disabled={isDisabled || draggedInside}
            onClick={!isDisabled ? handleUploadClick : undefined}
            variant="primary"
            buttonSize="small"
          >
            <LucideIcon name="Upload" />
            Upload an image
          </EditorButton>
        </div>
      </div>
      <input
        className="w-0 h-0 overflow-hidden opacity-0"
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
        disabled={isDisabled}
      />
    </div>
  );
};
