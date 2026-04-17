"use server";

import { adminProfileService } from "@/services/profile/admin.service";
import { updateTag } from "next/cache";

// Get admin profile
export const getAdminProfile = async () => {
    return await adminProfileService.getAdminProfile();
};

// Update admin profile
export const updateAdminProfile = async (data: { name: string; email: string; phone?: string }) => {
    const result = await adminProfileService.updateAdminProfile(data);
    if (result.success) {
        updateTag("admin-profile");
    }
    return result;
};

// Change password
export const adminChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    return await adminProfileService.adminChangePassword(data);
};

// Get active sessions
export const getAdminActiveSessions = async () => {
    return await adminProfileService.getAdminActiveSessions();
};

// Terminate session
export const adminTerminateSession = async (sessionId: string) => {
    const result = await adminProfileService.adminTerminateSession(sessionId);
    if (result.success) {
        updateTag("admin-sessions");
    }
    return result;
};

// Logout other sessions
export const adminLogoutOtherSessions = async () => {
    const result = await adminProfileService.adminLogoutOtherSessions();
    if (result.success) {
        updateTag("admin-sessions");
    }
    return result;
};

// Get activity logs
export const getAdminActivityLogs = async () => {
    return await adminProfileService.getAdminActivityLogs();
};

// Update preferences
export const adminUpdatePreferences = async (data: { notifications: any; theme: string }) => {
    return await adminProfileService.adminUpdatePreferences(data);
};

// Export activity logs
export const adminExportActivityLogs = async () => {
    return await adminProfileService.adminExportActivityLogs();
};

// Export account data
export const adminExportAccountData = async () => {
    return await adminProfileService.adminExportAccountData();
};

// Delete account
export const adminDeleteAccount = async (reason?: string) => {
    return await adminProfileService.adminDeleteAccount(reason);
};

// Upload avatar
export const adminUploadAvatar = async (formData: FormData) => {
    const result = await adminProfileService.adminUploadAvatar(formData);
    if (result.success) {
        updateTag("admin-profile");
    }
    return result;
};

// Remove avatar
export const adminRemoveAvatar = async () => {
    const result = await adminProfileService.adminRemoveAvatar();
    if (result.success) {
        updateTag("admin-profile");
    }
    return result;
};