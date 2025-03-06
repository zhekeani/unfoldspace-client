const calculateReadTime = (wordsCount: number): string => {
  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordsCount / wordsPerMinute);

  return minutes === 1 ? "1 min read" : `${minutes} min read`;
};

export const timeAgo = (isoDate: string): string => {
  const now = new Date();
  const pastDate = new Date(isoDate);
  const diffMs = now.getTime() - pastDate.getTime(); // Difference in milliseconds

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }
};

export default calculateReadTime;
