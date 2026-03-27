"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

export const getDashboardStats = async (params?: { range?: string }) => {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/admin/dashboard`);
        
        if (params?.range) {
            url.searchParams.append("range", params.range);
        }
        
        const res = await fetch(url.toString(), {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["dashboard-stats"] }
        });
        const data = await res.json();
        
        if (!res.ok) {
            return { data: null, error: { message: data.message || "Failed to fetch dashboard stats" } };
        }
        
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const getSellerDashboardStats = async (params?: { range?: string }) => {
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
            return { data: null, error: { message: data.message || "Failed to fetch dashboard stats" } };
        }
        
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};