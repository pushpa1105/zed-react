import { useTranslation } from '@/core/i18n/use-translation';
import { Page } from '@/core/layout/page';
import { useSearchParams } from '@/core/router/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { AppearanceSection } from '../components/appearance-section';
import { LanguageSection } from '../components/language-section';
import { ProfileSection } from '../components/profile-section';

const TABS = ['appearance', 'profile', 'language'] as const;
type Tab = (typeof TABS)[number];

const isTab = (value: string | null): value is Tab => TABS.includes(value as Tab);

export default function SettingsPage() {
  const { t } = useTranslation('settings');
  // The active tab lives in the URL (?tab=profile), so it can be linked to.
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('tab');
  const tab: Tab = isTab(requested) ? requested : 'appearance';

  return (
    <Page title={t('page.title')} description={t('page.description')}>
      <Tabs
        value={tab}
        onValueChange={(value) => setSearchParams({ tab: value }, { replace: true })}
        className="space-y-4"
      >
        <TabsList>
          {TABS.map((value) => (
            <TabsTrigger key={value} value={value}>
              {t(`tabs.${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="appearance">
          <AppearanceSection />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileSection />
        </TabsContent>
        <TabsContent value="language">
          <LanguageSection />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
