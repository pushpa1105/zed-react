import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getErrorMessage } from '@/core/api/errors';
import { credentialsSchema, useSignIn, type Credentials } from '@/core/auth/session';
import { routes } from '@/core/config/routes';
import { TextField } from '@/core/forms/text-field';
import { useTranslation } from '@/core/i18n/use-translation';
import { Link, useSearchParams } from '@/core/router/router';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/shared/ui/field';
import { Spinner } from '@/shared/ui/spinner';

/**
 * After a successful sign-in the session query is populated and the guest
 * guard redirects automatically, so `onSuccess` is optional.
 */
export function SignInForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const signIn = useSignIn();

  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('signIn.title')}</CardTitle>
        <CardDescription>{t('signIn.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => signIn.mutate(values, { onSuccess }))}
          noValidate
        >
          <FieldGroup>
            {signIn.isError && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage(signIn.error)}</AlertDescription>
              </Alert>
            )}
            <TextField
              control={form.control}
              name="email"
              label={t('fields.email')}
              type="email"
              autoComplete="email"
            />
            <TextField
              control={form.control}
              name="password"
              label={t('fields.password')}
              type="password"
              autoComplete="current-password"
            />
            <Field>
              <Button type="submit" disabled={signIn.isPending}>
                {signIn.isPending && <Spinner />} {t('signIn.submit')}
              </Button>
              <FieldDescription className="text-center">
                {t('signIn.noAccount')}{' '}
                <Link to={routes.register.href({ redirectTo })}>{t('signUp.submit')}</Link>
              </FieldDescription>
              <FieldDescription className="text-center text-xs">
                {t('signIn.demo')}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
