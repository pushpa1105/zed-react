import { useTranslation } from '@/core/i18n/use-translation';
import { ThemeCustomizer } from '@/core/theme/components/theme-customizer';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Switch } from '@/shared/ui/switch';

/** Theme editor next to a live preview of common components. */
export function AppearanceSection() {
  const { t } = useTranslation('settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('appearance.title')}</CardTitle>
        <CardDescription>{t('appearance.description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        <ThemeCustomizer />
        <section
          className="space-y-4 rounded-lg border bg-muted/30 p-6"
          aria-label={t('appearance.preview')}
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t('appearance.preview')}
          </p>
          <h3 className="text-lg font-semibold">{t('appearance.previewTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('appearance.previewText')}</p>
          <Input placeholder="you@example.com" aria-label="Email" />
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked /> {t('appearance.previewSwitch')}
          </label>
        </section>
      </CardContent>
    </Card>
  );
}
