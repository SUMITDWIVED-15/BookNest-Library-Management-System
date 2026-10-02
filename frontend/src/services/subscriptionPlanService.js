import axiosInstance from "./axiosInstance";

const subscriptionPlanService = {

    getAllPlans: async () => {
        const response = await axiosInstance.get(
            "/api/subscription-plans"
        );

        return response.data;
    },

    createPlan: async (planData) => {
        const response = await axiosInstance.post(
            "/api/subscription-plans/admin/create",
            planData
        );

        return response.data;
    },

    updatePlan: async (id, planData) => {
        const response = await axiosInstance.put(
            `/api/subscription-plans/admin/${id}`,
            planData
        );

        return response.data;
    },

    deletePlan: async (id) => {
        const response = await axiosInstance.delete(
            `/api/subscription-plans/admin/${id}`
        );

        return response.data;
    }
};

export default subscriptionPlanService;