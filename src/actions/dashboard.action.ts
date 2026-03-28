"use server";

import { dashboardService } from "@/services/dashboard.service";

// Get admin dashboard stats
export const getDashboardStats = async (params?: { range?: string }) => {
    return await dashboardService.getDashboardStats(params);
};

// Get seller dashboard stats
export const getSellerDashboardStats = async (params?: { range?: string }) => {
    return await dashboardService.getSellerDashboardStats(params);
};
