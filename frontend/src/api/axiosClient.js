import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Unexpected error";

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
