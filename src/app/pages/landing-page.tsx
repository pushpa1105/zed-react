import {
  Blocks,
  FileCheck2,
  Palette,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

import { useSession } from '@/core/auth/session';
import { HOME_AFTER_LOGIN, routes } from '@/core/config/routes';
import { siteConfig } from '@/core/config/site';
import { LanguageSwitcher } from '@/core/i18n/components/language-switcher';
import { useTranslation } from '@/core/i18n/use-translation';
import { Head } from '@/core/layout/head';
import { Link } from '@/core/router/router';
import { ModeToggle } from '@/core/theme/components/mode-toggle';
import { ThemeSheet } from '@/core/theme/components/theme-sheet';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { Logo } from '../shell/logo';

const POINTS: Array<{
  key: 'modules' | 'theme' | 'contracts' | 'access' | 'quality' | 'dx';
  icon: LucideIcon;
}> = [
  { key: 'modules', icon: Blocks },
  { key: 'theme', icon: Palette },
  { key: 'contracts', icon: FileCheck2 },
  { key: 'access', icon: ShieldCheck },
  { key: 'quality', icon: Workflow },
  { key: 'dx', icon: Sparkles },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const { data: user } = useSession();

  return (
    <div className="flex min-h-svh flex-col">
      <Head />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-4">
        <Logo />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeSheet />
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-16 px-4 py-16 md:py-24">
        <section className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge variant="secondary">{t('landing.badge')}</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            {t('landing.title')}
          </h1>
          <p className="text-lg text-balance text-muted-foreground">{t('landing.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to={user ? HOME_AFTER_LOGIN.href() : routes.login.href()}>
                {user ? t('landing.goToApp') : t('landing.getStarted')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={siteConfig.links.docs} target="_blank" rel="noreferrer">
                {t('landing.docs')}
              </a>
            </Button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map(({ key, icon: Icon }) => (
            <Card key={key}>
              <CardHeader>
                <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{t(`landing.points.${key}.title`)}</CardTitle>
                <CardDescription>{t(`landing.points.${key}.description`)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}
      </footer>
    </div>
  );
}
