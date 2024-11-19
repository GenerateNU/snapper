export const formatNumber = (number: number): string => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};

export const timeAgo = (date: Date = new Date()): string => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1)
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1)
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1)
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1)
    return interval === 1 ? '1 min ago' : `${interval} minutes ago`;
  return seconds === 1 ? '1s ago' : `${seconds}s ago`;
};

export const categorizeTime = (time: string) => {
  const now = new Date();
  const notificationDate = new Date(time);
  const diffInMs = now.getTime() - notificationDate.getTime();
  const diffInDays = diffInMs / (1000 * 3600 * 24);

  if (diffInDays < 1) return 'New';
  if (diffInDays < 2) return '1 day ago';
  if (diffInDays < 7) return `${Math.floor(diffInDays)} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years Ago`;
};
