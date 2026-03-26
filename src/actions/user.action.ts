"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { getSession } from "./auth.action"; // Import getSession

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

// Helper to verify admin access
const verifyAdmin = async () => {
    const { data: session, error } = await getSession();
    if (error || !session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return true;
};

export const getAllUsers = async (params?: {
    role?: string;
    status?: string;
    verified?: string;
    search?: string;
    sort?: string;
    page?: number;
}) => {
    try {
        await verifyAdmin(); // Check if admin
        
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/admin/users`);
        
        if (params?.role && params.role !== "all") url.searchParams.append("role", params.role);
        if (params?.status && params.status !== "all") url.searchParams.append("status", params.status);
        if (params?.verified && params.verified !== "all") url.searchParams.append("verified", params.verified);
        if (params?.search) url.searchParams.append("search", params.search);
        if (params?.sort) url.searchParams.append("sort", params.sort);
        if (params?.page) url.searchParams.append("page", params.page.toString());
        
        const res = await fetch(url.toString(), {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["admin-users"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch users" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: error instanceof Error ? error.message : "Something went wrong" } };
    }
};

export const banUser = async (userId: string) => {
    try {
        await verifyAdmin();
        
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to ban user" } };
        updateTag("admin-users");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: error instanceof Error ? error.message : "Something went wrong" } };
    }
};

export const unbanUser = async (userId: string) => {
    try {
        await verifyAdmin();
        
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to unban user" } };
        updateTag("admin-users");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: error instanceof Error ? error.message : "Something went wrong" } };
    }
};

export const changeUserRole = async (userId: string, newRole: string) => {
    try {
        await verifyAdmin();
        
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify({ role: newRole })
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to change role" } };
        updateTag("admin-users");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: error instanceof Error ? error.message : "Something went wrong" } };
    }
};