/**
 * Date utility functions
 */

export function getTimeAgo(date: string | Date): string {
  const now = new Date();
  const reviewDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - reviewDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return reviewDate.toLocaleDateString();
  }
}
