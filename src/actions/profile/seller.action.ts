"use server";

import { sellerProfileService } from "@/services/profile/seller.service";
import { updateTag } from "next/cache";

// ============ PROFILE FUNCTIONS ============

export const getSellerProfile = async () => {
    return await sellerProfileService.getSellerProfile();
};

export const getSellerStoreSettings = async () => {
    return await sellerProfileService.getSellerStoreSettings();
};

// ============ STORE MANAGEMENT ============

export const updateStoreInfo = async (data: { storeName?: string; storeDescription?: string }) => {
    const result = await sellerProfileService.updateStoreInfo(data);
    if (result.success) {
        updateTag("seller-profile");
        updateTag("seller-settings");
    }
    return result;
};

export const uploadStoreLogo = async (formData: FormData) => {
    const result = await sellerProfileService.uploadStoreLogo(formData);
    if (result.success) {
        updateTag("seller-profile");
    }
    return result;
};

export const updatePersonalInfo = async (data: { name: string; email: string; phone: string }) => {
    const result = await sellerProfileService.updatePersonalInfo(data);
    if (result.success) {
        updateTag("seller-profile");
    }
    return result;
};

export const updateBusinessHours = async (data: any) => {
    const result = await sellerProfileService.updateBusinessHours(data);
    if (result.success) {
        updateTag("seller-settings");
    }
    return result;
};

export const updateShippingSettings = async (data: any) => {
    const result = await sellerProfileService.updateShippingSettings(data);
    if (result.success) {
        updateTag("seller-settings");
    }
    return result;
};

export const updateReturnPolicy = async (data: any) => {
    const result = await sellerProfileService.updateReturnPolicy(data);
    if (result.success) {
        updateTag("seller-settings");
    }
    return result;
};

export const updatePayoutInfo = async (data: any) => {
    const result = await sellerProfileService.updatePayoutInfo(data);
    if (result.success) {
        updateTag("seller-settings");
    }
    return result;
};

export const updateNotificationPreferences = async (data: any) => {
    const result = await sellerProfileService.updateNotificationPreferences(data);
    if (result.success) {
        updateTag("seller-settings");
    }
    return result;
};

// ============ PASSWORD & SECURITY ============

export const sellerChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    return await sellerProfileService.sellerChangePassword(data);
};

export const getSellerActiveSessions = async () => {
    return await sellerProfileService.getSellerActiveSessions();
};

export const sellerTerminateSession = async (sessionId: string) => {
    const result = await sellerProfileService.sellerTerminateSession(sessionId);
    if (result.success) {
        updateTag("seller-sessions");
    }
    return result;
};

export const sellerLogoutOtherSessions = async () => {
    const result = await sellerProfileService.sellerLogoutOtherSessions();
    if (result.success) {
        updateTag("seller-sessions");
    }
    return result;
};

// ============ DOCUMENT MANAGEMENT ============

export const uploadDocument = async (formData: FormData) => {
    const result = await sellerProfileService.uploadDocument(formData);
    if (result.success) {
        updateTag("seller-documents");
    }
    return result;
};

export const deleteDocument = async (documentId: string) => {
    const result = await sellerProfileService.deleteDocument(documentId);
    if (result.success) {
        updateTag("seller-documents");
    }
    return result;
};

// ============ STORE STATUS ============

export const pauseStore = async (reason?: string) => {
    const result = await sellerProfileService.pauseStore(reason);
    if (result.success) {
        updateTag("seller-profile");
    }
    return result;
};

export const closeStore = async (reason?: string) => {
    const result = await sellerProfileService.closeStore(reason);
    if (result.success) {
        updateTag("seller-profile");
    }
    return result;
};

// ============ ACCOUNT MANAGEMENT ============

export const sellerDeleteAccount = async (reason?: string) => {
    return await sellerProfileService.sellerDeleteAccount(reason);
};