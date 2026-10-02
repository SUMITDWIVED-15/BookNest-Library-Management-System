import axiosInstance from "./axiosInstance";

const reservationService = {

    createReservation: async (reservationData) => {
        const response = await axiosInstance.post(
            "/api/reservations",
            reservationData
        );

        return response.data;
    },

    createReservationForUser: async (userId, reservationData) => {
        const response = await axiosInstance.post(
            `/api/reservations/user/${userId}`,
            reservationData
        );

        return response.data;
    },

    cancelReservation: async (id) => {
        const response = await axiosInstance.delete(
            `/api/reservations/${id}`
        );

        return response.data;
    },

    fulfillReservation: async (id) => {
        const response = await axiosInstance.post(
            `/api/reservations/${id}/fulfill`
        );

        return response.data;
    },

    getMyReservations: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/reservations/my",
            { params }
        );

        return response.data;
    },

    searchReservations: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/reservations",
            { params }
        );

        return response.data;
    }
};

export default reservationService;