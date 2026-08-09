import { toast } from 'sonner';

import { setGlobalLoading } from '../provider-bridges';

type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

type AsyncHandlerOptions<T> = {
  showLoader?: boolean;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  onSuccess?: (res: T) => void;
  onError?: (err: ApiErrorResponse) => void;
  onFinally?: () => void;
};

function isApiErrorResponse(err: unknown): err is ApiErrorResponse {
  return typeof err === 'object' && err !== null;
}

export const withAsyncHandler = async <
  T extends { data?: { message?: string } & Record<string, unknown> },
>(
  asyncFn: () => Promise<T>,
  options?: AsyncHandlerOptions<T>
) => {
  const {
    showLoader = true,
    showErrorToast = true,
    showSuccessToast = true,
    onSuccess,
    onError,
    onFinally,
  } = options || {};

  try {
    if (showLoader) setGlobalLoading(true);
    const res = await asyncFn();
    if (showSuccessToast) toast.success(res?.data?.message || 'Success');
    onSuccess?.(res);
    return res?.data;
  } catch (err) {
    const typedErr = isApiErrorResponse(err) ? err : {};

    if (onError) {
      onError(typedErr);
    } else if (showErrorToast) {
      toast.error(typedErr?.response?.data?.message || 'Something went wrong');
    }

    throw err; // allows optional caller catch
  } finally {
    if (showLoader) setGlobalLoading(false);
    onFinally?.();
  }
};
