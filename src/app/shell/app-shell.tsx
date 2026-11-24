import { Suspense } from 'react';

import { LanguageSwitcher } from '@/core/i18n/components/language-switcher';
import { useTranslation } from '@/core/i18n/use-translation';
import { Outlet } from '@/core/router/router';
import { ModeToggle } from '@/core/theme/components/mode-toggle';
import { ThemeSheet } from '@/core/theme/components/theme-sheet';
import { PageLoader } from '@/shared/components/page-loader';
import { Separator } from '@/shared/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/ui/sidebar';

import { AppSidebar } from './app-sidebar';
import { CommandMenu } from './command-menu';

/** Authenticated layout: collapsible sidebar, sticky header, page outlet. */
export function AppShell() {
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" aria-label={t('shell.toggleSidebar')} />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <CommandMenu />
          <div className="ml-auto flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeSheet />
            <ModeToggle />
          </div>
        </header>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
