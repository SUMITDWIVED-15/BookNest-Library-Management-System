import axiosInstance from "./axiosInstance";

const fineService = {

    createFine: async (fineData) => {
        const response = await axiosInstance.post(
            "/api/fines",
            fineData
        );

        return response.data;
    },

    payFine: async (id, transactionId = null) => {
        const params = transactionId
            ? { transactionId }
            : {};

        const response = await axiosInstance.post(
            `/api/fines/${id}/pay`,
            null,
            { params }
        );

        return response.data;
    },

    waiveFine: async (waiveData) => {
        const response = await axiosInstance.post(
            "/api/fines/waive",
            waiveData
        );

        return response.data;
    },

    getMyFines: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/fines/my",
            { params }
        );

        return response.data;
    },

    getAllFines: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/fines",
            { params }
        );

        return response.data;
    }
};

export default fineService;