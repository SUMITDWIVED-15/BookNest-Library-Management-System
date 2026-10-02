import axiosInstance from "./axiosInstance";

const subscriptionService = {

    subscribe: async (subscriptionData) => {
        const response = await axiosInstance.post(
            "/api/subscriptions/subscribe",
            subscriptionData
        );

        return response.data;
    },

    getActiveSubscription: async (userId = null) => {
        const params = userId
            ? { userId }
            : {};

        const response = await axiosInstance.get(
            "/api/subscriptions/user/active",
            { params }
        );

        return response.data;
    },

    cancelSubscription: async (subscriptionId, reason = null) => {
        const params = reason
            ? { reason }
            : {};

        const response = await axiosInstance.post(
            `/api/subscriptions/cancel/${subscriptionId}`,
            null,
            { params }
        );

        return response.data;
    },

    activateSubscription: async (subscriptionId, paymentId) => {
        const response = await axiosInstance.post(
            "/api/subscriptions/activate",
            null,
            {
                params: {
                    subscriptionId,
                    paymentId
                }
            }
        );

        return response.data;
    },

    getAllSubscriptions: async () => {
        const response = await axiosInstance.get(
            "/api/subscriptions/admin"
        );

        return response.data;
    },

    deactivateExpiredSubscriptions: async () => {
        const response = await axiosInstance.get(
            "/api/subscriptions/admin/deactivate-expired"
        );

        return response.data;
    }
};

export default subscriptionService;