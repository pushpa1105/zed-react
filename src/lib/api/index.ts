import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

let isHandlingAuthRefresh = false;

let failedQueue: {
  resolve: (val: any) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(p =>
    error ? p.reject(error) : p.resolve(null)
  );
  failedQueue = [];
};

const requestHandler = (request: InternalAxiosRequestConfig) => {
  request.headers.Accept = 'application/json'


  //const token = '82d17740b771f525a6087c4fcd2268b91f17e8adce4d0b877faab56c9530d1c6'

  //   request.headers.Authorization = `Bearer ${token}`

  // Add or remove this line based on your requirement
  return request
}

const responseHandler = (response: AxiosResponse) => {
  if (response?.data?.message) {

  }

  return response
}

const errorHandler = (error: AxiosError) => {

  if (error.response?.status == 401) {
    return handleAuthRefresh(error)
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

  return Promise.reject(error)
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => requestHandler(config),
  error => Promise.reject(error),
)

api.interceptors.response.use(
  response => responseHandler(response),
  error => errorHandler(error),
)


const handleAuthRefresh = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry: boolean };

  if (originalRequest?._retry) return Promise.reject(error)

  if (originalRequest.url?.includes("/auth/refresh")) {
    window.location.href = "/login";
    return Promise.reject(error);
  }

  if (isHandlingAuthRefresh) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => api(originalRequest))
  }

  originalRequest._retry = true;
  isHandlingAuthRefresh = true;

  const refreshInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
  })

  try {
    await refreshInstance.post("/auth/refresh")
    processQueue(null);
    return api(originalRequest);
  } catch (err) {
    processQueue(err);
    window.location.href = "/login";
  } finally {
    isHandlingAuthRefresh = false
  }
}

export default api;
