import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { type ApiError, toApiError } from '@/core/api/errors';
import { notify } from '@/core/notify/notify';
import { reportError } from '@/core/observability/report-error';

/**
 * Declarative side effects for queries and mutations, typed globally:
 *
 *   useMutation({
 *     mutationFn: createTask,
 *     meta: { invalidates: [tasksKeys.all], successMessage: 'Task created' },
 *   });
 *
 * The caches below act on `meta`, so feature hooks don't repeat the same
 * invalidate/toast boilerplate.
 */
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
    queryMeta: {
      /** Show a toast when this query fails (default: false; render the error inline). */
      errorToast?: boolean;
    };
    mutationMeta: {
      /** Query keys to invalidate after success. */
      invalidates?: QueryKey[];
      /** Toast shown on success. */
      successMessage?: string;
      /** Toast title on error. `false` disables the toast (e.g. forms showing inline errors). */
      errorMessage?: string | false;
    };
  }
}

function shouldReport(error: ApiError) {
  return !error.isClientError;
}

/** @param overrides  extra default options (tests turn retries off, for example). */
export function createQueryClient(overrides: { retry?: false; gcTime?: number } = {}) {
  const queryClient: QueryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (rawError, query) => {
        const error = toApiError(rawError);
        if (shouldReport(error)) reportError(error, { queryKey: query.queryKey });
        if (query.meta?.errorToast) notify.error(error.message);
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: async (_data, _variables, _context, mutation) => {
        const { successMessage, invalidates } = mutation.meta ?? {};
        if (successMessage) notify.success(successMessage);
        if (invalidates?.length) {
          await Promise.all(
            invalidates.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
          );
        }
      },
      onError: (rawError, _variables, _context, mutation) => {
        const error = toApiError(rawError);
        if (shouldReport(error)) reportError(error, { mutationKey: mutation.options.mutationKey });
        const title = mutation.meta?.errorMessage;
        if (title !== false && error.status !== 401) {
          notify.error(title ?? 'Something went wrong', { description: error.message });
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Client errors (4xx) and contract errors won't fix themselves.
          const apiError = toApiError(error);
          if (apiError.isClientError || apiError.code === 'contract') return false;
          return failureCount < 2;
        },
        ...overrides,
      },
      mutations: { retry: overrides.retry ?? 0 },
    },
  });

  return queryClient;
}

/** Lets callers pass extra `useMutation` options to a feature's mutation hook. */
export type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  'mutationFn'
>;
