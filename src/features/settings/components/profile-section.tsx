import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCurrentUser } from '@/core/auth/session';
import { TextField } from '@/core/forms/text-field';
import { useTranslation } from '@/core/i18n/use-translation';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { FieldGroup } from '@/shared/ui/field';
import { Spinner } from '@/shared/ui/spinner';

import { profileInputSchema, useUpdateProfile, type ProfileInput } from '../api/profile';

export function ProfileSection() {
  const { t } = useTranslation(['settings', 'common']);
  const user = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileInputSchema),
    values: { firstName: user.firstName, lastName: user.lastName, bio: user.bio },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title')}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))} noValidate>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                control={form.control}
                name="firstName"
                label={t('profile.firstName')}
                autoComplete="given-name"
              />
              <TextField
                control={form.control}
                name="lastName"
                label={t('profile.lastName')}
                autoComplete="family-name"
              />
            </div>
            <TextField
              control={form.control}
              name="bio"
              label={t('profile.bio')}
              description={t('profile.bioHint')}
              rows={3}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 justify-end">
          <Button type="submit" disabled={updateProfile.isPending || !form.formState.isDirty}>
            {updateProfile.isPending && <Spinner />} {t('common:actions.saveChanges')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
