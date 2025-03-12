import { mergeAttributes } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    largeBlockQuote: {
      setLargeBlockquote: () => ReturnType;
    };
  }
}

export const LargeBlockquote = Blockquote.extend({
  name: "largeBlockquote",

  addAttributes() {
    return {
      size: {
        default: "large",
        parseHTML: (element) => element.getAttribute("data-size") || "large",
        renderHTML: (attributes) => ({
          "data-size": attributes.size,
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["blockquote", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setLargeBlockquote:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: "largeBlockquote",
            attrs: { size: "large" },
            content: [
              {
                type: "paragraph",
              },
            ],
          });
        },
    };
  },
});

export default LargeBlockquote;
