export const extractUsernameFromUrl = (url: string) => {
  const match = url.match(/%40(.*)/);
  return match ? match[1] : null;
};
