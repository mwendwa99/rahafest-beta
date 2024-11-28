import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
const TOKEN_KEYS = {
  ACCESS: "token",
  REFRESH: "refresh_token",
};

const API_URLS = {
  TICKET: "https://api.ticketraha.com/api/",
  RAHA: "https://api.rahafest.com/api/",
  AUTH: "https://rahaclub.rahafest.com/api/",
};

// Create API instances
export const ticketApi = axios.create({ baseURL: API_URLS.TICKET });
export const rahaApi = axios.create({ baseURL: API_URLS.RAHA });

// Create protected instances
const protectedInstance = axios.create({ baseURL: API_URLS.TICKET });
const authInstance = axios.create({ baseURL: API_URLS.AUTH });

// Token management
const TokenManager = {
  isRefreshing: false,
  failedQueue: [],

  async getToken(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async setToken(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  async clearTokens() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  },
};

// Token refresh logic
async function refreshAccessToken() {
  try {
    const refreshToken = await TokenManager.getToken(TOKEN_KEYS.REFRESH);
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.get(`${API_URLS.TICKET}/refresh`, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    const newToken = response.data.token;
    await TokenManager.setToken(TOKEN_KEYS.ACCESS, newToken);
    return newToken;
  } catch (error) {
    // If refresh fails, clear tokens and throw error
    await TokenManager.clearTokens();
    throw error;
  }
}

// Create request interceptor factory
const createRequestInterceptor = (instance) => {
  return instance.interceptors.request.use(
    async (config) => {
      const token = await TokenManager.getToken(TOKEN_KEYS.ACCESS);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// Create response interceptor factory
const createResponseInterceptor = (instance) => {
  return instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Prevent infinite retry loops
      if (originalRequest._retry) {
        throw error;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        if (TokenManager.isRefreshing) {
          // Queue failed requests
          return new Promise((resolve, reject) => {
            TokenManager.failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        TokenManager.isRefreshing = true;
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();
          TokenManager.processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          TokenManager.processQueue(refreshError, null);
          throw refreshError;
        } finally {
          TokenManager.isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to protected instances
createRequestInterceptor(protectedInstance);
createRequestInterceptor(authInstance);
createResponseInterceptor(protectedInstance);
createResponseInterceptor(authInstance);

export default protectedInstance;
export { authInstance };
