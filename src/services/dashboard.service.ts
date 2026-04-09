import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const dashboardService = {
    // Get admin dashboard stats
    getDashboardStats: async (params?: { range?: string }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/admin`);
            
            if (params?.range) {
                url.searchParams.append("range", params.range);
            }
            
            const res = await fetch(url.toString(), {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["dashboard-stats"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to fetch dashboard stats"
                };
            }
            
            // Backend returns { success: true, data: {...} }
            return data;
        } catch (error) {
            console.error("Get dashboard stats error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get seller dashboard stats
    getSellerDashboardStats: async (params?: { range?: string }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/dashboard/seller`);
            
            if (params?.range) {
                url.searchParams.append("range", params.range);
            }
            
            const res = await fetch(url.toString(), {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-dashboard"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to fetch seller dashboard stats"
                };
            }
            
            // Backend returns { success: true, data: {...} }
            return data;
        } catch (error) {
            console.error("Get seller dashboard stats error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },
};