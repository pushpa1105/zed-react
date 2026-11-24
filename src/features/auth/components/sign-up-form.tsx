import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getErrorMessage } from '@/core/api/errors';
import { registrationSchema, useSignUp, type Registration } from '@/core/auth/session';
import { routes } from '@/core/config/routes';
import { TextField } from '@/core/forms/text-field';
import { useTranslation } from '@/core/i18n/use-translation';
import { Link, useSearchParams } from '@/core/router/router';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup } from '@/shared/ui/field';
import { Spinner } from '@/shared/ui/spinner';

export function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const signUp = useSignUp();

  const form = useForm<Registration>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('signUp.title')}</CardTitle>
        <CardDescription>{t('signUp.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((values) => signUp.mutate(values, { onSuccess }))}
          noValidate
        >
          <FieldGroup>
            {signUp.isError && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage(signUp.error)}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <TextField
                control={form.control}
                name="firstName"
                label={t('fields.firstName')}
                autoComplete="given-name"
              />
              <TextField
                control={form.control}
                name="lastName"
                label={t('fields.lastName')}
                autoComplete="family-name"
              />
            </div>
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
              autoComplete="new-password"
            />
            <Field>
              <Button type="submit" disabled={signUp.isPending}>
                {signUp.isPending && <Spinner />} {t('signUp.submit')}
              </Button>
              <FieldDescription className="text-center">
                {t('signUp.haveAccount')}{' '}
                <Link to={routes.login.href({ redirectTo })}>{t('signIn.submit')}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
