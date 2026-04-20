import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const adminProfileService = {
    // Get admin profile
    getAdminProfile: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["admin-profile"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch profile"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get admin profile error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Update admin profile
    updateAdminProfile: async (data: { name: string; email: string; phone?: string }) => {
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

            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update profile"
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update admin profile error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Change password
    adminChangePassword: async (data: { currentPassword: string; newPassword: string }) => {
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

            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to change password"
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Change password error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get active sessions
    getAdminActiveSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/sessions`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["admin-sessions"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch sessions"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get active sessions error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Terminate session
    adminTerminateSession: async (sessionId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/sessions/${sessionId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to terminate session"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Terminate session error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Logout other sessions
    adminLogoutOtherSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/sessions/logout-all`, {
                method: "POST",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to logout other devices"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Logout other sessions error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get activity logs
    getAdminActivityLogs: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/activity-logs`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["admin-logs"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch logs"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get activity logs error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Update preferences
    adminUpdatePreferences: async (data: { notifications: any; theme: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/preferences`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update preferences"
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update preferences error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Export activity logs
    adminExportActivityLogs: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/activity-logs/export`, {
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to export logs"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Export activity logs error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Export account data
    adminExportAccountData: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/account/export`, {
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to export data"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Export account data error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Delete account
    adminDeleteAccount: async (reason?: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/account`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ reason })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to delete account"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Delete account error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Upload avatar
    adminUploadAvatar: async (formData: FormData) => {
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

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to upload avatar"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Upload avatar error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },
    // /Remove avatar
    adminRemoveAvatar: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/admin/profile/avatar`, {
                method: "DELETE",
                headers: {
                    Cookie: cookieStore.toString()
                }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to remove avatar"
                };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Remove avatar error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    }
};
