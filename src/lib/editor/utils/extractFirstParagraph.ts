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

/**
 * Extracts the first text content from the JSON structure with a limit.
 */
export function extractFirstTextNode(
  content: JSONContent,
  maxLength = 60
): string {
  if (!content || !content.content) return "Untitled Story";

  for (const node of content.content) {
    if (node.type === "text" && node.text) return node.text.slice(0, maxLength);
    if (node.type === "paragraph" && node.content) {
      const textNode = node.content.find(
        (child) => child.type === "text" && child.text
      );
      if (textNode) return textNode.text!.slice(0, maxLength);
    }
  }

  return `Draft ${new Date().toISOString().split("T")[0]}`;
}
