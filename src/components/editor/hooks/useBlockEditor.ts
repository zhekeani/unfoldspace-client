import ExtensionKit from "@/components/editor/extensions/story-extension-kit";
import { AnyExtension, EditorOptions, useEditor } from "@tiptap/react";

export const useBlockEditor = ({
  content,
  ...editorOptions
}: Partial<Omit<EditorOptions, "extensions">>) => {
  const editor = useEditor({
    ...editorOptions,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: (ctx) => {
      if (ctx.editor.isEmpty) {
        ctx.editor.commands.setContent(content || "");
        ctx.editor.commands.focus("end", { scrollIntoView: true });
      }
    },
    extensions: [...ExtensionKit()].filter(
      (e): e is AnyExtension => e !== undefined
    ),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: "min-h-full story-editor",
      },
    },
  });

  return { editor };
};
