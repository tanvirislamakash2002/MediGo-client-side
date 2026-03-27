"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

// Customer profile functions (to be implemented)
export const getCustomerProfile = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/customer/profile`, {
            headers: { Cookie: cookieStore.toString() },
            next: { tags: ["customer-profile"] }
        });
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to fetch profile" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const updateCustomerProfile = async (data: { name: string; email: string; phone?: string; address?: string }) => {
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

export const customerUploadAvatar = async (formData: FormData | null) => {
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