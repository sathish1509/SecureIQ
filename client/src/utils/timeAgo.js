/**
 * Plain JS relative time formatter (e.g. "just now", "5 mins ago", "2 hrs ago").
 */
export function timeAgo(dateInput) {
  if (!dateInput) return 'N/A';

  let date;
  if (typeof dateInput === 'string') {
    let formattedStr = dateInput.trim();
    // Handle "2026-07-25 13:40:00 UTC" or "2026-07-25 13:40:00"
    if (formattedStr.endsWith(' UTC')) {
      formattedStr = formattedStr.replace(' UTC', 'Z').replace(' ', 'T');
    } else if (formattedStr.includes(' ') && !formattedStr.includes('T')) {
      formattedStr = formattedStr.replace(' ', 'T');
    }
    date = new Date(formattedStr);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return String(dateInput);
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 10) {
    return 'just now';
  }
  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? '1 hr ago' : `${hours} hrs ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }

  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}
