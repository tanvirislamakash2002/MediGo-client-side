"use server";

import { customerProfileService } from "@/services/profile/customer.service";
import { updateTag } from "next/cache";

// ============ PROFILE FUNCTIONS ============

export const getCustomerProfile = async () => {
    return await customerProfileService.getCustomerProfile();
};

export const updateCustomerProfile = async (data: { name?: string; email?: string; phone?: string; address?: string }) => {
    const result = await customerProfileService.updateCustomerProfile(data);
    if (result.success) {
        updateTag("customer-profile");
    }
    return result;
};

export const customerUploadAvatar = async (formData: FormData) => {
    const result = await customerProfileService.customerUploadAvatar(formData);
    if (result.success) {
        updateTag("customer-profile");
    }
    return result;
};

// ============ PASSWORD & SECURITY ============

export const customerChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    return await customerProfileService.customerChangePassword(data);
};

export const getCustomerActiveSessions = async () => {
    return await customerProfileService.getCustomerActiveSessions();
};

export const customerTerminateSession = async (sessionId: string) => {
    const result = await customerProfileService.customerTerminateSession(sessionId);
    if (result.success) {
        updateTag("customer-sessions");
    }
    return result;
};

export const customerLogoutOtherSessions = async () => {
    const result = await customerProfileService.customerLogoutOtherSessions();
    if (result.success) {
        updateTag("customer-sessions");
    }
    return result;
};

// ============ ADDRESS MANAGEMENT ============

export const getCustomerAddresses = async () => {
    return await customerProfileService.getCustomerAddresses();
};

export const addCustomerAddress = async (data: any) => {
    const result = await customerProfileService.addCustomerAddress(data);
    if (result.success) {
        updateTag("customer-addresses");
    }
    return result;
};

export const updateCustomerAddress = async (addressId: string, data: any) => {
    const result = await customerProfileService.updateCustomerAddress(addressId, data);
    if (result.success) {
        updateTag("customer-addresses");
    }
    return result;
};

export const deleteCustomerAddress = async (addressId: string) => {
    const result = await customerProfileService.deleteCustomerAddress(addressId);
    if (result.success) {
        updateTag("customer-addresses");
    }
    return result;
};

export const setDefaultAddress = async (addressId: string) => {
    const result = await customerProfileService.setDefaultAddress(addressId);
    if (result.success) {
        updateTag("customer-addresses");
    }
    return result;
};

// ============ ORDER MANAGEMENT ============

export const getCustomerOrders = async () => {
    return await customerProfileService.getCustomerOrders();
};

// ============ WISHLIST MANAGEMENT ============

export const getCustomerWishlist = async () => {
    return await customerProfileService.getCustomerWishlist();
};

// ============ REVIEW MANAGEMENT ============

export const getCustomerReviews = async () => {
    return await customerProfileService.getCustomerReviews();
};

export const deleteCustomerReview = async (reviewId: string) => {
    const result = await customerProfileService.deleteCustomerReview(reviewId);
    if (result.success) {
        updateTag("customer-reviews");
    }
    return result;
};

// ============ NOTIFICATION PREFERENCES ============

export const updateNotificationPreferences = async (data: any) => {
    const result = await customerProfileService.updateNotificationPreferences(data);
    if (result.success) {
        updateTag("customer-profile");
    }
    return result;
};

// ============ ACCOUNT MANAGEMENT ============

export const customerDeleteAccount = async (reason?: string) => {
    return await customerProfileService.customerDeleteAccount(reason);
};