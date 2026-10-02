import axios from "axios";
import { getToken } from "../utils/token";
import API_BASE_URL from "./apiConfig";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle API errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(
                "API Error:",
                error.response.status,
                error.response.data
            );
        } else if (error.request) {
            console.error("Network Error: No response received.");
        } else {
            console.error("Request Error:", error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
