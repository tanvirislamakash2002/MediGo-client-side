import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const customerProfileService = {
    // ============ PROFILE FUNCTIONS ============
    
    getCustomerProfile: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/profile`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["customer-profile"] }
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
            console.error("Get customer profile error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updateCustomerProfile: async (data: { name?: string; email?: string; phone?: string; address?: string }) => {
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
            console.error("Update customer profile error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    customerUploadAvatar: async (formData: FormData) => {
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

    // ============ PASSWORD & SECURITY ============
    
    customerChangePassword: async (data: { currentPassword: string; newPassword: string }) => {
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

    getCustomerActiveSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/sessions`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["customer-sessions"] }
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

    customerTerminateSession: async (sessionId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/sessions/${sessionId}`, {
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

    customerLogoutOtherSessions: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/sessions/logout-all`, {
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

    // ============ ADDRESS MANAGEMENT ============
    
    getCustomerAddresses: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/addresses`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["customer-addresses"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch addresses"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get addresses error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    addCustomerAddress: async (data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to add address"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Add address error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    updateCustomerAddress: async (addressId: string, data: any) => {
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
            
            if (!res.ok) {
                return {
                    success: false,
                    message: result.message || "Failed to update address"
                };
            }
            
            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error("Update address error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    deleteCustomerAddress: async (addressId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/addresses/${addressId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to delete address"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Delete address error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    setDefaultAddress: async (addressId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/addresses/${addressId}/default`, {
                method: "PATCH",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to set default address"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Set default address error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ ORDER MANAGEMENT ============
    
    getCustomerOrders: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/orders`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["customer-orders"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch orders"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get orders error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ WISHLIST MANAGEMENT ============
    
    getCustomerWishlist: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/wishlist`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["customer-wishlist"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch wishlist"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get wishlist error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ REVIEW MANAGEMENT ============
    
    getCustomerReviews: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/reviews`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["customer-reviews"] }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch reviews"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Get reviews error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    deleteCustomerReview: async (reviewId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/customer/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to delete review"
                };
            }
            
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error("Delete review error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // ============ NOTIFICATION PREFERENCES ============
    
    updateNotificationPreferences: async (data: any) => {
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

    // ============ ACCOUNT MANAGEMENT ============
    
    customerDeleteAccount: async (reason?: string) => {
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