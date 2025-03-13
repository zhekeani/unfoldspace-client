import { useResponseBlockEditor } from "@/components/editor/hooks/userResponseEditor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { EditorContent, JSONContent } from "@tiptap/react";
import { Bold, Italic } from "lucide-react";
import { useEffect } from "react";

type ResponseEditorProps = {
  content: JSONContent;
  setContent: (newContent: JSONContent) => void;
  isEditable: boolean;
  isSubmitting?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCloseCb?: () => void;
  onSubmit: () => void;
};

const ResponseEditor = ({
  content,
  setContent,
  isEditable,
  isSubmitting = false,
  isOpen,
  setIsOpen,
  onCloseCb,
  onSubmit,
}: ResponseEditorProps) => {
  const { editor } = useResponseBlockEditor({
    content: content,
    editable: isEditable,
  });

  const onCancel = () => {
    setIsOpen(false);
    if (onCloseCb) onCloseCb();
  };

  useEffect(() => {
    if (!editor) return;

    const handleTransaction = () => {
      const newContent = editor.getJSON();
      if (JSON.stringify(newContent) !== JSON.stringify(content)) {
        setContent(newContent);
      }
    };

    const handleFocus = () => setIsOpen(true);

    editor.on("transaction", handleTransaction);
    editor.on("focus", handleFocus);

    return () => {
      editor.off("transaction", handleTransaction);
      editor.off("focus", handleFocus);
    };
  }, [editor, content, setContent, setIsOpen]);

  useEffect(() => {
    if (!editor) return;

    if (!isOpen) {
      editor.commands.clearContent(true);
      setContent({ type: "doc", content: [] });
    }
  }, [isOpen, editor, setContent]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "response-editor w-full relative transition-all duration-300 ease-in-out overflow-hidden rounded-sm flex flex-col",
        isOpen ? "min-h-[160px] bg-gray-50" : "min-h-[40px] bg-gray-100"
      )}
    >
      <div
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen && "mb-[60px]"
        )}
      >
        <EditorContent
          placeholder="What are your thoughts?"
          editor={editor}
          className="response-editor ProseMirror p-4 min-h-full placeholder:!text-black"
        />
      </div>

      <div className="absolute w-full h-full pointer-events-none flex items-end">
        <div
          className={cn(
            "h-[60px] w-full bottom-0 left-0 right-0 text-center text-sm text-gray-600 transition-opacity duration-300 flex justify-between px-3 py-3",
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex gap-1">
            <Toggle
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              aria-label="Toggle bold"
              className={cn(
                "rounded-md p-1 transition-colors",
                editor.isActive("bold")
                  ? "!bg-gray-200 text-gray-900 shadow-sm"
                  : "bg-transparent hover:!bg-gray-200 text-gray-600"
              )}
            >
              <Bold className="w-4 h-4" strokeWidth={2} />
            </Toggle>

            <Toggle
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              aria-label="Toggle italic"
              className={cn(
                "rounded-md p-1 transition-colors",
                editor.isActive("italic")
                  ? "!bg-gray-200 text-gray-900 shadow-sm"
                  : "bg-transparent hover:!bg-gray-200 text-gray-600"
              )}
            >
              <Italic className="w-4 h-4" strokeWidth={2} />
            </Toggle>
          </div>

          <div className="flex gap-2">
            <Button
              className="rounded-full font-normal"
              onClick={onCancel}
              variant="ghost"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full font-normal"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Respond"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseEditor;
