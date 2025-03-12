import { JSONContent } from "@tiptap/react";

/**
 * Extracts text from a Tiptap JSONContent and counts words.
 * @param content Tiptap JSONContent
 * @returns number of words in the content
 */
export function countWordsFromJSONContent(content: JSONContent): number {
  if (!content || !content.content) return 0;

  const extractText = (node: JSONContent): string => {
    if (node.type === "text" && node.text) {
      return node.text;
    }

    if (node.content) {
      return node.content.map(extractText).join(" ");
    }

    return "";
  };

  const text = extractText(content);
  return text.trim().split(/\s+/).filter(Boolean).length;
}
