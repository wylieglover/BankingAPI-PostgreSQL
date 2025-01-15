import axios from "axios";
import { isTokenExpired } from "@/context/authUtils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((newToken: string) => void)[] = [];

function subscribeToRefresh(callback: (newToken: string) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshSuccess(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    if (isTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true },
          );

          const newToken = refreshResponse.data.token;
          localStorage.setItem("authToken", newToken);

          onRefreshSuccess(newToken);
          isRefreshing = false;
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          localStorage.removeItem("authToken");
          localStorage.removeItem("customer");
          window.location.href = "/login";
          throw new axios.Cancel("Token expired and refresh failed");
        }
      }
      return new Promise((resolve) => {
        subscribeToRefresh((newToken: string) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          resolve(config);
        });
      });
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("customer");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
