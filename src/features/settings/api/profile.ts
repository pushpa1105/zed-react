import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/core/api/client';
import { sessionKeys, userSchema, type User } from '@/core/auth/session';
import { useTranslation } from '@/core/i18n/use-translation';
import type { MutationOptions } from '@/core/query/query-client';

export const profileInputSchema = z.object({
  firstName: z.string().trim().min(1, 'validation.required'),
  lastName: z.string().trim().min(1, 'validation.required'),
  bio: z.string().max(280, 'validation.tooLong'),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

export function useUpdateProfile(options?: MutationOptions<User, ProfileInput>) {
  const { t } = useTranslation('settings');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProfileInput) => api.patch('/users/me', input, userSchema),
    ...options,
    meta: { successMessage: t('profile.saved'), ...options?.meta },
    onSuccess: (user, ...rest) => {
      // The session holds the current user: update it in place, no refetch.
      queryClient.setQueryData(sessionKeys.user, user);
      return options?.onSuccess?.(user, ...rest);
    },
  });
}
