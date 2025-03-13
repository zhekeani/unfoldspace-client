export const sanitizeTopic = (str: string) =>
  str
    .trim()
    .replace(/\s+/g, " ") // Normalize spaces to a single space
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("+");
