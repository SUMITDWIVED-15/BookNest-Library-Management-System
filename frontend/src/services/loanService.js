import axiosInstance from "./axiosInstance";

const loanService = {

    checkoutBook: async (checkoutData) => {
        const response = await axiosInstance.post(
            "/api/book-loans/checkout",
            checkoutData
        );

        return response.data;
    },

    checkoutBookForUser: async (userId, checkoutData) => {
        const response = await axiosInstance.post(
            `/api/book-loans/checkout/user/${userId}`,
            checkoutData
        );

        return response.data;
    },

    checkinBook: async (checkinData) => {
        const response = await axiosInstance.post(
            "/api/book-loans/checkin",
            checkinData
        );

        return response.data;
    },

    renewLoan: async (renewalData) => {
        const response = await axiosInstance.post(
            "/api/book-loans/renew",
            renewalData
        );

        return response.data;
    },

    getMyLoans: async (params = {}) => {
        const response = await axiosInstance.get(
            "/api/book-loans/my",
            { params }
        );

        return response.data;
    },

    searchLoans: async (searchData) => {
        const response = await axiosInstance.post(
            "/api/book-loans/search",
            searchData
        );

        return response.data;
    },

    updateOverdueLoans: async () => {
        const response = await axiosInstance.post(
            "/api/book-loans/admin/update-overdue"
        );

        return response.data;
    }
};

export default loanService;