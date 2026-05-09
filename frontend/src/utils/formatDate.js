import { format, formatDistance, parseISO, isValid } from 'date-fns';

export function formatDate(date, fmt = 'MMM dd, yyyy') {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return '—';
    return format(parsed, fmt);
  } catch {
    return '—';
  }
}

export function formatDateTime(date) {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

export function formatTime(date) {
  return formatDate(date, 'HH:mm');
}

export function formatRelative(date) {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(parsed, new Date(), { addSuffix: true });
  } catch {
    return '—';
  }
}

export function formatDuration(minutes) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
