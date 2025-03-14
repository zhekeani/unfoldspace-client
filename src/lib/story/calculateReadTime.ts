const calculateReadTime = (wordsCount: number): string => {
  const wordsPerMinute = 250;
  const minutes = Math.ceil(wordsCount / wordsPerMinute);

  return minutes === 1 ? "1 min read" : `${minutes} min read`;
};

export const timeAgo = (isoDate: string): string => {
  const now = new Date();
  const pastDate = new Date(isoDate);

  const nowInUS = new Date(new Intl.DateTimeFormat("en-US").format(now));

  const diffMs = nowInUS.getTime() - pastDate.getTime();
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
