"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

export const getSellerProfile = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["seller-profile"] }
        });

        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch profile" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const getSellerStoreSettings = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/settings`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["seller-settings"] }
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch settings" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateStoreInfo = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/store`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update store" } };
        updateTag("seller-profile");
        updateTag("seller-settings");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const uploadStoreLogo = async (formData: FormData) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/store/logo`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() },
            body: formData
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to upload logo" } };
        updateTag("seller-profile");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updatePersonalInfo = async (data: { name: string; email: string; phone: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/personal`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update personal info" } };
        updateTag("seller-profile");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateBusinessHours = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/hours`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update hours" } };
        updateTag("seller-settings");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateShippingSettings = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/shipping`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update shipping" } };
        updateTag("seller-settings");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateReturnPolicy = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/return-policy`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update policy" } };
        updateTag("seller-settings");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updatePayoutInfo = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/payout`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update payout info" } };
        updateTag("seller-settings");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateNotificationPreferences = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/notifications`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update preferences" } };
        updateTag("seller-settings");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const sellerChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/change-password`, {
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

export const getSellerActiveSessions = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/sessions`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["seller-sessions"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch sessions" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const sellerTerminateSession = async (sessionId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/sessions/${sessionId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to terminate session" } };
        updateTag("seller-sessions");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const sellerLogoutOtherSessions = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/sessions/logout-all`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to logout other devices" } };
        updateTag("seller-sessions");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const uploadDocument = async (formData: FormData) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/documents`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() },
            body: formData
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to upload document" } };
        updateTag("seller-documents");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const deleteDocument = async (documentId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/documents/${documentId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to delete document" } };
        updateTag("seller-documents");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const pauseStore = async (reason?: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/pause`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify({ reason })
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to pause store" } };
        updateTag("seller-profile");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const closeStore = async (reason?: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/close`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify({ reason })
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to close store" } };
        updateTag("seller-profile");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const sellerDeleteAccount = async (reason?: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/seller/profile/account`, {
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