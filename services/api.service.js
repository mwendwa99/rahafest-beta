import axios from "axios";

//export an unprotected instance of axios
export const chatApi = axios.create({
  baseURL: "https://rahachat.stackthon.com/api",
});

const instance = axios.create({
  baseURL: "https://rahachat.stackthon.com/api",
});

// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    // Get the access token from localStorage
    const token = localStorage.getItem("token");
    // If the access token is available, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Return a successful response directly
    return response;
  },
  async (error) => {
    // Handle 403 or 401 errors and refresh the token
    const originalRequest = error.config;
    if (error.response.status === 403 || error.response.status === 401) {
      // Perform token refresh and update the original request
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Call your refresh token endpoint
        const refreshResponse = await instance.get("/refresh", {
          refresh_token: refreshToken,
        });
        const newToken = refreshResponse.data.token;
        // Save the new access token to localStorage
        localStorage.setItem("token", newToken);
        // Update the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Retry the original request
        return instance(originalRequest);
      } else {
        // No refresh token available, redirect to login or handle the situation accordingly
        // return Promise.reject(error);
        // const refreshResponse = await instance.get("/refresh");
        const refreshResponse = await axios.get(
          "https://rahachat.stackthon.com/apirefresh"
        );
        const newToken = refreshResponse.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      }
    }
    // For other errors, just reject with the error
    return Promise.reject(error);
  }
);

export default instance;
