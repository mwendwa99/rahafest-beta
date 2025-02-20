import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStore } from "../store/instance";
import { clearUser } from "../store/auth/authSlice";

// Function to determine if we're in development
const isDevelopment = () => {
  return __DEV__;
};

// Get the appropriate base URL depending on environment
const getBaseUrl = () => {
  if (isDevelopment()) {
    return "https://rahaclub.rahafest.com/api/";
  }
  return "https://rahaclub.rahafest.com/api/";
};

const instance = axios.create({
  baseURL: getBaseUrl(),
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Helper functions for token management
const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.get(`${getBaseUrl()}refresh`, {
          withCredentials: true,
        });

        const newToken = refreshResponse.data.token;
        if (!newToken) {
          throw new Error("No token received");
        }

        await setToken(newToken);

        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        onTokenRefreshed(newToken);
        return instance(originalRequest);
      } catch (refreshError) {
        const store = getStore();
        store.dispatch(clearUser());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
