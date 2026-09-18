import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          api(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await refreshClient.post("/auth/refresh");

      const newAccessToken = response.data.accessToken;

      useAuthStore.getState().setAccessToken(newAccessToken);

      notifyRefreshSubscribers(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
