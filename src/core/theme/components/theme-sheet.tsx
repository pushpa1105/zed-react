import { Palette } from 'lucide-react';

import { useTranslation } from '@/core/i18n/use-translation';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

import { ThemeCustomizer } from './theme-customizer';

/** Header button that opens the theme customizer in a side sheet. */
export function ThemeSheet() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('theme.customize')}>
          <Palette className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('theme.customize')}</SheetTitle>
          <SheetDescription>{t('theme.description')}</SheetDescription>
        </SheetHeader>
        <ThemeCustomizer className="px-4 pb-6" />
      </SheetContent>
    </Sheet>
  );
}
