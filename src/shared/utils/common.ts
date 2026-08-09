import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractInitials = (val: string): string => {
  if (!val) return '';

  return val
    .trim()
    .split(/\s+/) // split by multiple spaces
    .slice(0, 2) // take first two words
    .map((word) => word[0]?.toUpperCase())
    .join('');
};
