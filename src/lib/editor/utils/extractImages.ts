import { JSONContent } from "@tiptap/react";

/**
 * Recursively extracts all image src URLs from a Tiptap JSONContent.
 * @param content - The JSONContent object from Tiptap.
 * @returns An array of image URLs.
 */
export const extractImageUrlsFromJSONContent = (
  content: JSONContent
): string[] => {
  const imageUrls: string[] = [];

  const traverse = (node: JSONContent) => {
    if (!node) return;

    if (node.type === "imageBlock" && node.attrs?.src) {
      imageUrls.push(node.attrs.src);
    }

    if (node.content) {
      node.content.forEach(traverse);
    }
  };

  traverse(content);

  return Array.from(new Set(imageUrls));
};
