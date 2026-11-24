import { useTranslation } from '@/core/i18n/use-translation';
import { Head } from '@/core/layout/head';

import { SignUpForm } from '../components/sign-up-form';

export default function SignUpPage() {
  const { t } = useTranslation('auth');
  return (
    <>
      <Head title={t('signUp.submit')} />
      <SignUpForm />
    </>
  );
}
