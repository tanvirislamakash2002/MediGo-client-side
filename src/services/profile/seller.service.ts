import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const sellerProfileService = {
    // ============ PROFILE FUNCTIONS ============
    
    getSellerProfile: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-profile"] }
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
            console.error("Get seller profile error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    getSellerStoreSettings: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/settings`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-settings"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch settings"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get store settings error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ STORE MANAGEMENT ============
    
    updateStoreInfo: async (data: { storeName?: string; storeDescription?: string }) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/store`, {
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
                    message: result.message || "Failed to update store"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update store info error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    uploadStoreLogo: async (formData: FormData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/store/logo`, {
                method: "POST",
                headers: { Cookie: cookieStore.toString() },
                body: formData
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to upload logo"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Upload logo error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updatePersonalInfo: async (data: { name: string; email: string; phone: string }) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update personal info"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update personal info error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updateBusinessHours: async (data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update business hours"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update business hours error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updateShippingSettings: async (data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update shipping settings"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update shipping settings error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updateReturnPolicy: async (data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update return policy"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update return policy error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updatePayoutInfo: async (data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update payout info"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update payout info error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updateNotificationPreferences: async (data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update notification preferences"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update notification preferences error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ PASSWORD & SECURITY ============
    
    sellerChangePassword: async (data: { currentPassword: string; newPassword: string }) => {
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

    getSellerActiveSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/sessions`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-sessions"] }
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

    sellerTerminateSession: async (sessionId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/sessions/${sessionId}`, {
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

    sellerLogoutOtherSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/sessions/logout-all`, {
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

    // ============ DOCUMENT MANAGEMENT ============
    
    uploadDocument: async (formData: FormData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/documents`, {
                method: "POST",
                headers: { Cookie: cookieStore.toString() },
                body: formData
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to upload document"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Upload document error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    deleteDocument: async (documentId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/seller/profile/documents/${documentId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to delete document"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Delete document error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ STORE STATUS ============
    
    pauseStore: async (reason?: string) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to pause store"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Pause store error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    closeStore: async (reason?: string) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to close store"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Close store error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ ACCOUNT MANAGEMENT ============
    
    sellerDeleteAccount: async (reason?: string) => {
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
    }
};