import axiosInstance from "./axiosInstance";

const genreService = {

    createGenre: async (genreData) => {
        const response = await axiosInstance.post(
            "/api/genres/create",
            genreData
        );

        return response.data;
    },

    getAllGenres: async () => {
        const response = await axiosInstance.get(
            "/api/genres/"
        );

        return response.data;
    },

    getGenreById: async (genreId) => {
        const response = await axiosInstance.get(
            `/api/genres/${genreId}`
        );

        return response.data;
    },

    updateGenre: async (genreId, genreData) => {
        const response = await axiosInstance.put(
            `/api/genres/${genreId}`,
            genreData
        );

        return response.data;
    },

    deleteGenre: async (genreId) => {
        const response = await axiosInstance.delete(
            `/api/genres/${genreId}`
        );

        return response.data;
    },

    hardDeleteGenre: async (genreId) => {
        const response = await axiosInstance.delete(
            `/api/genres/${genreId}/hard`
        );

        return response.data;
    },

    getTopLevelGenres: async () => {
        const response = await axiosInstance.get(
            "/api/genres/top-level"
        );

        return response.data;
    },

    getTotalActiveGenres: async () => {
        const response = await axiosInstance.get(
            "/api/genres/count"
        );

        return response.data;
    },

    getBookCountByGenre: async (genreId) => {
        const response = await axiosInstance.get(
            `/api/genres/${genreId}/book-count`
        );

        return response.data;
    }
};

export default genreService;