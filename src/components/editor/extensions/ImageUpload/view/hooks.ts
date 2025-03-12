import { AddStroyImage } from "@/actions/story/addStory";
import { useStoryEditor } from "@/components/context/StoryEditorContext";
import {
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

export const useUploader = ({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) => {
  const { storyId } = useStoryEditor();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!storyId) {
        console.error("Cannot upload image without a valid story ID.");
        return;
      }

      setLoading(true);

      startTransition(async () => {
        try {
          console.log(file);
          const response = await AddStroyImage(storyId, file);

          if (!response.success || !response.data.remoteUrl) {
            console.error("Image upload failed:", response.error);
            toast.error("Image upload failed", { description: response.error });
          }

          onUpload(response.data!.remoteUrl);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          const error = err?.response?.data?.error || "Something went wrong";
          console.error(error);
          toast.error("Image upload failed", {
            description: "Something went wrong.",
          });
        } finally {
          setLoading(false);
        }
      });
    },
    [onUpload, storyId]
  );

  return { loading: loading || isPending, uploadFile };
};

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  return { ref: fileInput, handleUploadClick };
};

export const useDropZone = ({
  uploader,
}: {
  uploader: (file: File) => void;
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedInside, setDraggedInside] = useState<boolean>(false);

  useEffect(() => {
    const dragStartHandler = () => {
      setIsDragging(true);
    };

    const dragEndHandler = () => {
      setIsDragging(false);
    };

    document.body.addEventListener("dragstart", dragStartHandler);
    document.body.addEventListener("dragend", dragEndHandler);

    return () => {
      document.body.removeEventListener("dragstart", dragStartHandler);
      document.body.removeEventListener("dragend", dragEndHandler);
    };
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      setDraggedInside(false);
      if (e.dataTransfer.files.length === 0) {
        return;
      }

      const fileList = e.dataTransfer.files;

      const files: File[] = [];
      console.log(fileList);

      for (let i = 0; i < fileList.length; i += 1) {
        const item = fileList.item(i);
        if (item) {
          files.push(item);
        }
      }

      if (files.some((file) => file.type.indexOf("image") === -1)) {
        return;
      }

      const filteredFiles = files.filter((f) => f.type.startsWith("image/"));

      if (filteredFiles.length > 0) {
        uploader(filteredFiles[0]);
      }
    },
    [uploader]
  );

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedInside(true);
  };

  const onDragLeave = () => {
    setDraggedInside(false);
  };

  return {
    isDragging,
    draggedInside,
    onDragEnter,
    onDragLeave,
    onDrop,
  };
};
