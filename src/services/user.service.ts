import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;
const AUTH_URL = env.AUTH_URL;

export const userService = {
    // Get current session
    getSession: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString()
                },
                cache: 'no-store'
            });
            const session = await res.json();
            
            if (session === null) {
                return { 
                    success: false, 
                    message: "Session is missing." 
                };
            }
            
            return { 
                success: true, 
                data: session 
            };
        } catch (error) {
            console.error("Get session error:", error);
            return { 
                success: false, 
                message: 'Something went wrong' 
            };
        }
    },

    // Get all users
    getAllUsers: async (params?: {
        role?: string;
        status?: string;
        verified?: string;
        search?: string;
        sort?: string;
        page?: number;
    }) => {
        try {
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
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to fetch users"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Get all users error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Ban user
    banUser: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
                method: "POST",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to ban user"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Ban user error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Unban user
    unbanUser: async (userId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
                method: "POST",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to unban user"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Unban user error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Change user role
    changeUserRole: async (userId: string, newRole: string) => {
        try {
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
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || "Failed to change role"
                };
            }
            
            return { 
                success: true,
                data: data.data || data
            };
        } catch (error) {
            console.error("Change user role error:", error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },
};