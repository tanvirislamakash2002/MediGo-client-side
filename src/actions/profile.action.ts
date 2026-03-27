"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

export const getAdminProfile = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/profile`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["admin-profile"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch profile" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateProfile = async (data: { name: string; email: string; phone?: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update profile" } };
        updateTag("admin-profile");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/profile/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to change password" } };
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const getActiveSessions = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/sessions`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["admin-sessions"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch sessions" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const terminateSession = async (sessionId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/sessions/${sessionId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to terminate session" } };
        updateTag("admin-sessions");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const logoutOtherSessions = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/sessions/logout-all`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to logout other devices" } };
        updateTag("admin-sessions");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const getAdminActivityLogs = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/activity-logs`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["admin-logs"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch logs" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updatePreferences = async (data: { notifications: any; theme: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/preferences`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update preferences" } };
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const exportActivityLogs = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/activity-logs/export`, {
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to export logs" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const exportAccountData = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/account/export`, {
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to export data" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const deleteAccount = async (reason?: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/admin/account`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify({ reason })
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to delete account" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// Upload avatar
export const uploadAvatar = async (formData: FormData | null) => {
    try {
        const cookieStore = await cookies();
        
        const res = await fetch(`${API_URL}/admin/profile/avatar`, {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to upload avatar" } };
        updateTag("admin-profile");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};