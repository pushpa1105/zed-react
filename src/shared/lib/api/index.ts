import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ROUTES } from '../../constants';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isHandlingAuthRefresh = false;

let failedQueue: {
  resolve: (val: unknown) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
};

const requestHandler = (
  request: InternalAxiosRequestConfig & {
    skipAuthRefresh?: boolean;
  }
) => {
  request.headers.Accept = 'application/json';

  return request;
};

const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: AxiosError) => {
  if (error.response?.status == 401) {
    return handleAuthRefresh(error);
  }
  // if (error.response?.status === 403) {
  //   window.location.href = '/not-authorized'
  // }

  if (error.response?.status === 404) {
    // window.location.href = '/not-found'
  }

  // if (error.response?.status === 500) {
  //   window.location.href = '/server/error'
  // }
  if (error.code === 'ERR_NETWORK') {
    // window.location.href = '/server/error'
  }

  return Promise.reject(error);
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => requestHandler(config),
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

const handleAuthRefresh = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  };

  // Don't attempt refresh for calls that are explicitly opted out,
  // for the login request itself, or for already-retried requests
  if (
    originalRequest?._retry ||
    originalRequest?.skipAuthRefresh ||
    originalRequest.url?.includes(ROUTES.LOGIN)
  ) {
    return Promise.reject(error);
  }

  if (originalRequest.url?.includes('/auth/refresh')) {
    redirectToLogin();
    return Promise.reject(error);
  }

  if (isHandlingAuthRefresh) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => api(originalRequest));
  }

  originalRequest._retry = true;
  isHandlingAuthRefresh = true;

  const refreshInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  try {
    await refreshInstance.post('/auth/refresh');
    processQueue(null);
    return api(originalRequest);
  } catch (err) {
    processQueue(err);
    redirectToLogin(); // guarded version
  } finally {
    isHandlingAuthRefresh = false;
  }
};

// Guard against redirecting (and reloading) when already there
const redirectToLogin = () => {
  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.href = ROUTES.LOGIN;
  }
};

export default api;
