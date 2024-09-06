import axios from "axios";
// import Cookies from "js-cookie";
import AsyncStorage from "@react-native-async-storage/async-storage";

//export an unprotected instance of axios
export const ticketApi = axios.create({
  baseURL: "https://api.ticketraha.com/api/",
});

export const rahaApi = axios.create({
  baseURL: "https://api.rahafest.com/api/",
});

export const rahaImageApi = "https://api.rahafest.com";
export const tickohImageApi = "https://api.ticketraha.com";

const instance = axios.create({
  baseURL: "https://api.ticketraha.com/api/",
});

const authInstance = axios.create({
  baseURL: "https://rahaclub.rahafest.com/api/",
});

async function refreshTokenAndRetryRequest(error, instance) {
  const originalRequest = error.config;
  // const refreshToken = Cookies.get("refresh_token"); // Get refresh token from cookies
  const refreshToken = await AsyncStorage.getItem("refresh_token");

  if (refreshToken) {
    try {
      const refreshResponse = await axios.get(
        `${originalRequest.baseURL}/refresh`
      );
      const newToken = refreshResponse.data.token;
      // localStorage.setItem("token", newToken);
      await AsyncStorage.setItem("token", newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return instance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  } else {
    // Handle the case when there's no refresh token
    return Promise.reject(error);
  }
}

instance.interceptors.request.use(
  async (config) => {
    // const token = localStorage.getItem("token");
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      return refreshTokenAndRetryRequest(error, instance);
    }
    return Promise.reject(error);
  }
);

authInstance.interceptors.request.use(
  async (config) => {
    // const token = localStorage.getItem("token");
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      return refreshTokenAndRetryRequest(error, authInstance);
    }
    return Promise.reject(error);
  }
);

export default instance;
export { authInstance };
