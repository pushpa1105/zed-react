import { AxiosError } from 'axios';
import { ZodError } from 'zod';

/**
 * Every failure coming out of the API layer is normalized to an `ApiError`,
 * so UI code only ever deals with one error shape.
 */
export class ApiError extends Error {
  readonly status: number | null;
  readonly code: 'network' | 'http' | 'contract';
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status?: number | null; code: ApiError['code']; details?: unknown },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? null;
    this.code = options.code;
    this.details = options.details;
  }

  /** 4xx: the request was wrong; retrying won't help. */
  get isClientError() {
    return this.status !== null && this.status >= 400 && this.status < 500;
  }
}

export function toApiError(error: unknown, url?: string): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof ZodError) {
    // The backend answered with a shape the frontend doesn't expect.
    return new ApiError(`Unexpected response from ${url ?? 'the server'}`, {
      code: 'contract',
      details: error.issues,
    });
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    if (!error.response) {
      return new ApiError('Network error: check your connection', { code: 'network' });
    }
    return new ApiError(data?.message ?? error.message, {
      code: 'http',
      status: error.response.status,
      details: data,
    });
  }

  return new ApiError(error instanceof Error ? error.message : 'Something went wrong', {
    code: 'network',
  });
}

/** Human-readable message for any thrown value. */
export function getErrorMessage(error: unknown): string {
  return toApiError(error).message;
}
