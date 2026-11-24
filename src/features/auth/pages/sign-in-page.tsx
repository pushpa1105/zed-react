import { useTranslation } from '@/core/i18n/use-translation';
import { Head } from '@/core/layout/head';

import { SignInForm } from '../components/sign-in-form';

export default function SignInPage() {
  const { t } = useTranslation('auth');
  return (
    <>
      <Head title={t('signIn.submit')} />
      <SignInForm />
    </>
  );
}
