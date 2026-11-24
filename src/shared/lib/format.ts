import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date: number | string | Date, format = 'MMM D, YYYY h:mm A') =>
  dayjs(date).format(format);

export const formatRelative = (date: number | string | Date) => dayjs(date).fromNow();

export const getInitials = (...names: Array<string | undefined>) =>
  names
    .filter(Boolean)
    .map((n) => n!.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
