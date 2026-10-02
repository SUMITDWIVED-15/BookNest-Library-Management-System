import axiosInstance from "./axiosInstance";

const paymentService = {

    verifyPayment: async (paymentData) => {
        const response = await axiosInstance.post(
            "/api/payments/verify",
            paymentData
        );

        return response.data;
    },

    getAllPayments: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/payments",
            { params }
        );

        return response.data;
    }
};

export default paymentService;