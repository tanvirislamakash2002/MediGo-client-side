"use server";

import { userService } from "@/services/user.service";
import { updateTag } from "next/cache";
import { getSession } from "./auth.action";

// Verify admin access
const verifyAdmin = async () => {
    const { data: session, error } = await getSession();
    if (error || !session || session.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
    return true;
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
    try {
        await verifyAdmin();
        return await userService.getAllUsers(params);
    } catch (error) {
        return {
            data: null,
            error: { message: error instanceof Error ? error.message : "Something went wrong" }
        };
    }
};

// Ban user
export const banUser = async (userId: string) => {
    try {
        await verifyAdmin();
        const result = await userService.banUser(userId);
        if (!result.error) {
            updateTag("admin-users");
        }
        return result;
    } catch (error) {
        return {
            data: null,
            error: { message: error instanceof Error ? error.message : "Something went wrong" }
        };
    }
};

// Unban user
export const unbanUser = async (userId: string) => {
    try {
        await verifyAdmin();
        const result = await userService.unbanUser(userId);
        if (!result.error) {
            updateTag("admin-users");
        }
        return result;
    } catch (error) {
        return {
            data: null,
            error: { message: error instanceof Error ? error.message : "Something went wrong" }
        };
    }
};

// Change user role
export const changeUserRole = async (userId: string, newRole: string) => {
    try {
        await verifyAdmin();
        const result = await userService.changeUserRole(userId, newRole);
        if (!result.error) {
            updateTag("admin-users");
        }
        return result;
    } catch (error) {
        return {
            data: null,
            error: { message: error instanceof Error ? error.message : "Something went wrong" }
        };
    }
};