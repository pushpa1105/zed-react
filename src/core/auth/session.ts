import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api, TOKEN_KEY } from '@/core/api/client';
import { entitySchema } from '@/core/api/schemas';
import { storage } from '@/shared/lib/storage';

/*
 * The session is infrastructure, not a feature: the router, the app shell and
 * several features read it. The sign-in *screens* live in `features/auth`.
 */

// ---- Contract ---------------------------------------------------------------

export const ROLES = ['ADMIN', 'USER'] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

export const userSchema = entitySchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: roleSchema,
  bio: z.string(),
});
export type User = z.infer<typeof userSchema>;

const authResponseSchema = z.object({ jwt: z.string(), user: userSchema });

export const credentialsSchema = z.object({
  email: z.email('validation.email'),
  password: z.string().min(5, 'validation.passwordMin'),
});
export type Credentials = z.infer<typeof credentialsSchema>;

export const registrationSchema = credentialsSchema.extend({
  firstName: z.string().trim().min(1, 'validation.required'),
  lastName: z.string().trim().min(1, 'validation.required'),
});
export type Registration = z.infer<typeof registrationSchema>;

// ---- Requests ---------------------------------------------------------------

async function fetchSession(): Promise<User | null> {
  if (!storage.get(TOKEN_KEY)) return null;
  try {
    return await api.get('/auth/me', userSchema);
  } catch {
    return null;
  }
}

// ---- Queries & mutations ------------------------------------------------------

export const sessionKeys = { user: ['session', 'user'] as const };

export const sessionQueryOptions = () =>
  queryOptions({ queryKey: sessionKeys.user, queryFn: fetchSession, staleTime: Infinity });

/** The signed-in user, or `null`. */
export const useSession = () => useQuery(sessionQueryOptions());

/** The signed-in user. Only call it below `<RequireAuth>`, where a user is guaranteed. */
export function useCurrentUser(): User {
  const { data } = useSession();
  if (!data) throw new Error('useCurrentUser() must be used inside an authenticated route');
  return data;
}

function useStartSession<TInput>(
  request: (input: TInput) => Promise<z.infer<typeof authResponseSchema>>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: request,
    meta: { errorMessage: false }, // forms render the error inline
    onSuccess: ({ jwt, user }) => {
      storage.set(TOKEN_KEY, jwt);
      queryClient.setQueryData(sessionKeys.user, user);
    },
  });
}

export const useSignIn = () =>
  useStartSession((input: Credentials) => api.post('/auth/login', input, authResponseSchema));

export const useSignUp = () =>
  useStartSession((input: Registration) => api.post('/auth/register', input, authResponseSchema));

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/auth/logout', undefined),
    meta: { errorMessage: false },
    onSettled: () => {
      storage.remove(TOKEN_KEY);
      queryClient.clear();
      queryClient.setQueryData(sessionKeys.user, null);
    },
  });
}
