import { LanguageSwitcher } from '@/core/i18n/components/language-switcher';
import { Outlet } from '@/core/router/router';
import { ModeToggle } from '@/core/theme/components/mode-toggle';

import { Logo } from './logo';

/** Centered layout for guest pages (sign in, sign up). */
export function AuthShell() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <header className="flex items-center justify-between p-4">
        <Logo />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
