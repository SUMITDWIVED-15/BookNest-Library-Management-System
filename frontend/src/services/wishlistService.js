import axiosInstance from "./axiosInstance";

const wishlistService = {

    addToWishlist: async (bookId, notes = null) => {
        const params = notes
            ? { notes }
            : {};

        const response = await axiosInstance.post(
            `/api/wishlist/add/${bookId}`,
            null,
            { params }
        );

        return response.data;
    },

    removeFromWishlist: async (bookId) => {
        const response = await axiosInstance.delete(
            `/api/wishlist/remove/${bookId}`
        );

        return response.data;
    },

    getMyWishlist: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/wishlist/my-wishlist",
            { params }
        );

        return response.data;
    }
};

export default wishlistService;