import { toast } from 'sonner';

/**
 * Notification adapter. Code calls `notify.success(...)` instead of a toast
 * library, so replacing the library (or routing messages elsewhere) is a
 * one-file change. ESLint forbids importing `sonner` outside this folder and
 * `shared/ui/sonner.tsx`.
 */
type NotifyOptions = { description?: string };

export const notify = {
  success: (message: string, options?: NotifyOptions) => {
    toast.success(message, options);
  },
  error: (message: string, options?: NotifyOptions) => {
    toast.error(message, options);
  },
  info: (message: string, options?: NotifyOptions) => {
    toast.info(message, options);
  },
};
