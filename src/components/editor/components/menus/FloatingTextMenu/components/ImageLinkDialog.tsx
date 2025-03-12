import { EditorButton } from "@/components/editor/components/ui/EditorButton";
import { LucideIcon } from "@/components/icons/LucideIcon";
import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";

export type ImageLinkDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
};

export const ImageLinkDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: ImageLinkDialogProps) => {
  const [url, setUrl] = useState("");

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = () => {
    if (isValidUrl) {
      onSubmit(url);
      setUrl(""); // Reset input after submission
      onClose();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-neutral-900 p-4 rounded-lg shadow-lg w-[24rem]">
          <Dialog.Title className="text-lg font-medium text-neutral-900 dark:text-white">
            Insert Image Link
          </Dialog.Title>
          <Dialog.Description className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Paste the URL of the image you want to insert.
          </Dialog.Description>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full mt-3 p-2 border rounded-md bg-transparent dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close asChild>
              <EditorButton variant="secondary" className="font-normal">
                Cancel
              </EditorButton>
            </Dialog.Close>
            <EditorButton
              variant="primary"
              onClick={handleSubmit}
              disabled={!isValidUrl}
              className="font-normal"
            >
              <LucideIcon name="Check" />
              Insert
            </EditorButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
