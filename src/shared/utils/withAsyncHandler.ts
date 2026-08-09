/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'sonner';

import { setGlobalLoading } from '../provider-bridges';

type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
      data?: {
        data?: any;
        [key: string]: any;
      };
      [key: string]: any;
    };
  };
  message?: string;
  [key: string]: any;
};

type ApiErrorSuccess = {
  data?: {
    message?: string;
    data?: {
      data?: any;
      [key: string]: any;
    };
    [key: string]: any;
  };
  message?: string;
  [key: string]: any;
};

type AsyncHandlerOptions = {
  showLoader?: boolean;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  onSuccess?: (res: ApiErrorSuccess) => void;
  onError?: (err: ApiErrorResponse) => void;
  onFinally?: () => void;
};

export const withAsyncHandler = async <T>(
  asyncFn: () => Promise<T>,
  options?: AsyncHandlerOptions
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
  } catch (err: unknown) {
    if (onError) {
      onError(err as ApiErrorResponse);
    } else if (showErrorToast) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }

    throw err; // allows optional caller catch
  } finally {
    if (showLoader) setGlobalLoading(false);
    onFinally?.();
  }
};
