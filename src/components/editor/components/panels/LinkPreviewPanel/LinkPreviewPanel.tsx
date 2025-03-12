import { EditorToolbar } from "@/components/editor/components/ui/EditorToolbar";
import { Surface } from "@/components/editor/components/ui/Surface";
import { LucideIcon } from "@/components/icons/LucideIcon";

export type LinkPreviewPanelProps = {
  url: string;
  onEdit: () => void;
  onClear: () => void;
};

export const LinkPreviewPanel = ({
  onClear,
  onEdit,
  url,
}: LinkPreviewPanelProps) => {
  const sanitizedLink = url?.startsWith("javascript:") ? "" : url;
  return (
    <Surface className="flex items-center gap-2 p-2">
      <a
        href={sanitizedLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline break-all"
      >
        {url}
      </a>
      <EditorToolbar.Divider />

      <EditorToolbar.Button onClick={onEdit}>
        <LucideIcon name="Pen" />
      </EditorToolbar.Button>

      <EditorToolbar.Button onClick={onClear}>
        <LucideIcon name="Trash2" />
      </EditorToolbar.Button>
    </Surface>
  );
};
