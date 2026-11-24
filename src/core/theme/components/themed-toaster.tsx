import { Toaster } from '@/shared/ui/sonner';

import { useResolvedThemeMode } from '../engine';

/** Toast container that follows the app's light/dark mode. */
export function ThemedToaster() {
  const theme = useResolvedThemeMode();
  return <Toaster theme={theme} richColors closeButton position="top-right" />;
}
