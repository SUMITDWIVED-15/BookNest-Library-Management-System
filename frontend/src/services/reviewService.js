import axiosInstance from "./axiosInstance";

const reviewService = {

    createReview: async (reviewData) => {
        const response = await axiosInstance.post(
            "/api/reviews",
            reviewData
        );

        return response.data;
    },

    updateReview: async (id, reviewData) => {
        const response = await axiosInstance.put(
            `/api/reviews/${id}`,
            reviewData
        );

        return response.data;
    },

    deleteReview: async (id) => {
        const response = await axiosInstance.delete(
            `/api/reviews/${id}`
        );

        return response.data;
    },

    getReviewsByBook: async (bookId, params = {}) => {
        const response = await axiosInstance.get(
            `/api/reviews/book/${bookId}`,
            { params }
        );

        return response.data;
    }
};

export default reviewService;