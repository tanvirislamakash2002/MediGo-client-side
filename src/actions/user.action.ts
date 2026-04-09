"use server";

import { userService } from "@/services/user.service";
import { updateTag } from "next/cache";
import { getSession } from "./auth.action";

// Verify admin access - returns structured response instead of throwing
const verifyAdmin = async () => {
    const result = await getSession();
    const session = result.success ? result.data : null;
    
    if (!result.success || !session || session.user?.role !== "ADMIN") {
        return {
            success: false,
            message: "Unauthorized: Admin access required"
        };
    }
    return { success: true };
};

// Get all users
export const getAllUsers = async (params?: {
    role?: string;
    status?: string;
    verified?: string;
    search?: string;
    sort?: string;
    page?: number;
}) => {
    const auth = await verifyAdmin();
    if (!auth.success) {
        return auth;
    }
    return await userService.getAllUsers(params);
};

// Ban user
export const banUser = async (userId: string) => {
    const auth = await verifyAdmin();
    if (!auth.success) {
        return auth;
    }
    const result = await userService.banUser(userId);
    if (result.success) {
        updateTag("admin-users");
    }
    return result;
};

// Unban user
export const unbanUser = async (userId: string) => {
    const auth = await verifyAdmin();
    if (!auth.success) {
        return auth;
    }
    const result = await userService.unbanUser(userId);
    if (result.success) {
        updateTag("admin-users");
    }
    return result;
};

// Change user role
export const changeUserRole = async (userId: string, newRole: string) => {
    const auth = await verifyAdmin();
    if (!auth.success) {
        return auth;
    }
    const result = await userService.changeUserRole(userId, newRole);
    if (result.success) {
        updateTag("admin-users");
    }
    return result;
};