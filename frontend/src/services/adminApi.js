import api from "./axiosInstance";

const page = (data) => ({
    content: data?.content || [],
    pageNumber:
        data?.pageNumber ??
        data?.number ??
        0,
    pageSize:
        data?.pageSize ??
        data?.size ??
        20,
    totalPages:
        data?.totalPages ?? 1,
    totalElements:
        data?.totalElements ??
        (data?.content?.length || 0),
    first:
        data?.first ?? true,
    last:
        data?.last ?? true,
    empty:
        data?.empty ??
        !(data?.content?.length),
});

export const adminApi = {

    books: {

        list: (params = {}) =>
            api
                .get("/api/books", { params })
                .then((r) => page(r.data)),

        search: (data) =>
            api
                .post("/api/books/search", data)
                .then((r) => page(r.data)),

        get: (id) =>
            api
                .get(`/api/books/${id}`)
                .then((r) => r.data),

        stats: () =>
            api
                .get("/api/books/stats")
                .then((r) => r.data),

        create: (data) =>
            api
                .post("/api/admin/books", data)
                .then((r) => r.data),

        bulkCreate: (data) =>
            api
                .post("/api/admin/books/bulk", data)
                .then((r) => r.data),

        update: (id, data) =>
            api
                .put(`/api/books/${id}`, data)
                .then((r) => r.data),

        softDelete: (id) =>
            api
                .delete(`/api/books/${id}`)
                .then((r) => r.data),

        hardDelete: (id) =>
            api
                .delete(`/api/books/${id}/permanent`)
                .then((r) => r.data),
    },

    loans: {

        search: (data) =>
            api
                .post("/api/book-loans/search", data)
                .then((r) => page(r.data)),

        checkout: (userId, data) =>
            api
                .post(
                    `/api/book-loans/checkout/user/${userId}`,
                    data
                )
                .then((r) => r.data),

        checkin: (data) =>
            api
                .post("/api/book-loans/checkin", data)
                .then((r) => r.data),

        renew: (data) =>
            api
                .post("/api/book-loans/renew", data)
                .then((r) => r.data),

        updateOverdue: () =>
            api
                .post("/api/book-loans/admin/update-overdue")
                .then((r) => r.data),
    },

    fines: {

        list: (params = {}) =>
            api
                .get("/api/fines", { params })
                .then((r) => page(r.data)),

        create: (data) =>
            api
                .post("/api/fines", data)
                .then((r) => r.data),

        pay: (id, transactionId) =>
            api
                .post(
                    `/api/fines/${id}/pay`,
                    null,
                    {
                        params: transactionId
                            ? { transactionId }
                            : {},
                    }
                )
                .then((r) => r.data),

        waive: (data) =>
            api
                .post("/api/fines/waive", data)
                .then((r) => r.data),
    },

    reservations: {

        list: (params = {}) =>
            api
                .get("/api/reservations", { params })
                .then((r) => page(r.data)),

        createForUser: (userId, data) =>
            api
                .post(
                    `/api/reservations/user/${userId}`,
                    data
                )
                .then((r) => r.data),

        cancel: (id) =>
            api
                .delete(`/api/reservations/${id}`)
                .then((r) => r.data),

        fulfill: (id) =>
            api
                .post(`/api/reservations/${id}/fulfill`)
                .then((r) => r.data),
    },

    genres: {

        list: () =>
            api
                .get("/api/genres/")
                .then((r) => r.data),

        topLevel: () =>
            api
                .get("/api/genres/top-level")
                .then((r) => r.data),

        count: () =>
            api
                .get("/api/genres/count")
                .then((r) => r.data),

        bookCount: (id) =>
            api
                .get(`/api/genres/${id}/book-count`)
                .then((r) => r.data),

        get: (id) =>
            api
                .get(`/api/genres/${id}`)
                .then((r) => r.data),

        create: (data) =>
            api
                .post("/api/genres/create", data)
                .then((r) => r.data),

        update: (id, data) =>
            api
                .put(`/api/genres/${id}`, data)
                .then((r) => r.data),

        softDelete: (id) =>
            api
                .delete(`/api/genres/${id}`)
                .then((r) => r.data),

        hardDelete: (id) =>
            api
                .delete(`/api/genres/${id}/hard`)
                .then((r) => r.data),
    },

    users: {

        list: () =>
            api
                .get("/api/users/list")
                .then((r) => r.data),
    },

    subscriptions: {

        list: () =>
            api
                .get("/api/subscriptions/admin")
                .then((r) => r.data),

        deactivateExpired: () =>
            api
                .get(
                    "/api/subscriptions/admin/deactivate-expired"
                )
                .then((r) => r.data),

        cancel: (id, reason) =>
            api
                .post(
                    `/api/subscriptions/cancel/${id}`,
                    null,
                    {
                        params: reason
                            ? { reason }
                            : {},
                    }
                )
                .then((r) => r.data),

        activate: (
            subscriptionId,
            paymentId
        ) =>
            api
                .post(
                    "/api/subscriptions/activate",
                    null,
                    {
                        params: {
                            subscriptionId,
                            paymentId,
                        },
                    }
                )
                .then((r) => r.data),
    },

    plans: {

        list: () =>
            api
                .get("/api/subscription-plans")
                .then((r) => r.data),

        create: (data) =>
            api
                .post(
                    "/api/subscription-plans/admin/create",
                    data
                )
                .then((r) => r.data),

        update: (id, data) =>
            api
                .put(
                    `/api/subscription-plans/admin/${id}`,
                    data
                )
                .then((r) => r.data),

        delete: (id) =>
            api
                .delete(
                    `/api/subscription-plans/admin/${id}`
                )
                .then((r) => r.data),
    },

    payments: {

        list: (params = {}) =>
            api
                .get("/api/payments", { params })
                .then((r) => page(r.data)),
    },
};