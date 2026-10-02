import axiosInstance from "./axiosInstance";

const bookService = {

    getBooks: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/books",
            { params }
        );

        return response.data;
    },

    getBookById: async (id) => {
        const response = await axiosInstance.get(
            `/api/books/${id}`
        );

        return response.data;
    },

    searchBooks: async (searchData) => {
        const response = await axiosInstance.post(
            "/api/books/search",
            searchData
        );

        return response.data;
    },

    getBookStats: async () => {
        const response = await axiosInstance.get(
            "/api/books/stats"
        );

        return response.data;
    },

    createBook: async (bookData) => {
        const response = await axiosInstance.post(
            "/api/admin/books",
            bookData
        );

        return response.data;
    },

    createBooksBulk: async (books) => {
        const response = await axiosInstance.post(
            "/api/admin/books/bulk",
            books
        );

        return response.data;
    },

    updateBook: async (id, bookData) => {
        const response = await axiosInstance.put(
            `/api/books/${id}`,
            bookData
        );

        return response.data;
    },

    deleteBook: async (id) => {
        const response = await axiosInstance.delete(
            `/api/books/${id}`
        );

        return response.data;
    },

    hardDeleteBook: async (id) => {
        const response = await axiosInstance.delete(
            `/api/books/${id}/permanent`
        );

        return response.data;
    }
};

export default bookService;