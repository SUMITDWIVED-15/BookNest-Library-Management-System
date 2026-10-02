import axiosInstance from "./axiosInstance";

const authService = {

    signup: async (userData) => {
        const response = await axiosInstance.post(
            "/auth/signup",
            userData
        );

        return response.data;
    },

    login: async (loginData) => {
        const response = await axiosInstance.post(
            "/auth/login",
            loginData
        );

        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await axiosInstance.post(
            "/auth/forgot-password",
            { email }
        );

        return response.data;
    },

    resetPassword: async (resetData) => {
        const response = await axiosInstance.post(
            "/auth/reset-password",
            resetData
        );

        return response.data;
    }
};

export default authService;