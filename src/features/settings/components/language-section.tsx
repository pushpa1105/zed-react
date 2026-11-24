import { LANGUAGES } from '@/core/i18n/languages';
import { useTranslation } from '@/core/i18n/use-translation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export function LanguageSection() {
  const { t, i18n } = useTranslation('settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('language.title')}</CardTitle>
        <CardDescription>{t('language.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={i18n.resolvedLanguage}
          onValueChange={(lng) => void i18n.changeLanguage(lng)}
        >
          <SelectTrigger className="w-56" aria-label={t('language.title')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
