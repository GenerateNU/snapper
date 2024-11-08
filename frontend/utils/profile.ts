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
  if (interval >= 1) return interval === 1 ? '1y ago' : `${interval}y ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval === 1 ? '1m ago' : `${interval}m ago`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval === 1 ? '1d ago' : `${interval}d ago`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval === 1 ? '1h ago' : `${interval}h ago`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval === 1 ? '1m ago' : `${interval}m ago`;
  return seconds === 1 ? '1s ago' : `${seconds}s ago`;
};
