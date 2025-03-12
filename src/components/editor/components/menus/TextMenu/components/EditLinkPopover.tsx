import { EditorToolbar } from "@/components/editor/components/ui/EditorToolbar";
import { LinkEditorPanel } from "@/components/editor/components/panels/LinkEditorPanel/LinkEditorPanel";
import { LucideIcon } from "@/components/icons/LucideIcon";
import * as Popover from "@radix-ui/react-popover";

export type EditLinkPopoverProps = {
  onSetLink: (link: string, openInNewTab?: boolean) => void;
};

export const EditLinkPopover = ({ onSetLink }: EditLinkPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <EditorToolbar.Button>
          <LucideIcon name="Link" />
        </EditorToolbar.Button>
      </Popover.Trigger>
      <Popover.Content>
        <LinkEditorPanel onSetLink={onSetLink} />
      </Popover.Content>
    </Popover.Root>
  );
};
