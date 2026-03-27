"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

// ============ PROFILE FUNCTIONS ============

export const getCustomerProfile = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/profile`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-profile"] }
        });
        console.log('object----', res);
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch profile" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateCustomerProfile = async (data: { name?: string; email?: string; phone?: string; address?: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update profile" } };
        updateTag("customer-profile");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const customerUploadAvatar = async (formData: FormData) => {
    try {
        const cookieStore = await cookies();
        
        const res = await fetch(`${API_URL}/customer/profile/avatar`, {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to upload avatar" } };
        updateTag("customer-profile");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ PASSWORD & SECURITY ============

export const customerChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/change-password`, {
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

export const getCustomerActiveSessions = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/sessions`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-sessions"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch sessions" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const customerTerminateSession = async (sessionId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/sessions/${sessionId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to terminate session" } };
        updateTag("customer-sessions");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const customerLogoutOtherSessions = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/sessions/logout-all`, {
            method: "POST",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to logout other devices" } };
        updateTag("customer-sessions");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ ADDRESS MANAGEMENT ============

export const getCustomerAddresses = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/addresses`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-addresses"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch addresses" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const addCustomerAddress = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/addresses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to add address" } };
        updateTag("customer-addresses");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateCustomerAddress = async (addressId: string, data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/addresses/${addressId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update address" } };
        updateTag("customer-addresses");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const deleteCustomerAddress = async (addressId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/addresses/${addressId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to delete address" } };
        updateTag("customer-addresses");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const setDefaultAddress = async (addressId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/addresses/${addressId}/default`, {
            method: "PATCH",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to set default address" } };
        updateTag("customer-addresses");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ ORDER MANAGEMENT ============

export const getCustomerOrders = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/orders`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-orders"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch orders" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ WISHLIST MANAGEMENT ============

export const getCustomerWishlist = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/wishlist`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-wishlist"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch wishlist" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ REVIEW MANAGEMENT ============

export const getCustomerReviews = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/reviews`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-reviews"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch reviews" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const deleteCustomerReview = async (reviewId: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/reviews/${reviewId}`, {
            method: "DELETE",
            headers: { Cookie: cookieStore.toString() }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to delete review" } };
        updateTag("customer-reviews");
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ NOTIFICATION PREFERENCES ============

export const updateNotificationPreferences = async (data: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/notifications`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (!res.ok) return { data: null, error: { message: result.message || "Failed to update preferences" } };
        updateTag("customer-profile");
        return { data: result.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

// ============ ACCOUNT MANAGEMENT ============

export const customerDeleteAccount = async (reason?: string) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/account`, {
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