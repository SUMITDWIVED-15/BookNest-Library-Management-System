import axiosInstance from "./axiosInstance";

const userService = {

    getProfile: async () => {
        const response = await axiosInstance.get(
            "/api/users/profile"
        );

        return response.data;
    },

    getAllUsers: async () => {
        const response = await axiosInstance.get(
            "/api/users/list"
        );

        return response.data;
    }
};

export default userService;