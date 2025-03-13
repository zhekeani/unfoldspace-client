import { EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Placeholder from "@tiptap/extension-placeholder";

export const responseEditorExtensions = [
  StarterKit.configure({
    bold: false,
    italic: false,
  }),
  Bold,
  Italic,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => "",
  }),
];

export const useResponseBlockEditor = ({
  content,
  ...editorOptions
}: Partial<Omit<EditorOptions, "extensions">>) => {
  const editor = useEditor({
    ...editorOptions,
    extensions: responseEditorExtensions,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: "min-h-full",
      },
    },
    onCreate: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent(content || "");
      }
    },
  });

  return { editor };
};
