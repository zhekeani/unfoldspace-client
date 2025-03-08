import { JSONContent } from "@tiptap/react";

/**
 * Extracts the first paragraph's text from a Tiptap JSONContent.
 * @param content - The Tiptap JSONContent object.
 * @returns The first paragraph's text or an empty string if none is found.
 */
export function extractFirstParagraph(content: JSONContent): string | null {
  if (!content || !content.content) return null;

  for (const node of content.content) {
    if (node.type === "paragraph" && node.content) {
      return node.content
        .map((child) => child.text || "")
        .join(" ")
        .trim();
    }
  }

  return null;
}
