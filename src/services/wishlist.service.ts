// services/wishlist.service.ts
import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const wishlistService = {
    // Add to wishlist
    addToWishlist: async (medicineId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ medicineId })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to add to wishlist"
                };
            }

            return data;
        } catch (error) {
            console.error("Add to wishlist error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Remove from wishlist
    removeFromWishlist: async (medicineId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/wishlist/${medicineId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to remove from wishlist"
                };
            }

            return data;
        } catch (error) {
            console.error("Remove from wishlist error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get wishlist
    getWishlist: async (page: number = 1, limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/wishlist?page=${page}&limit=${limit}`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["wishlist"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch wishlist"
                };
            }

            return data;
        } catch (error) {
            console.error("Get wishlist error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Check if in wishlist
    checkInWishlist: async (medicineId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/wishlist/check/${medicineId}`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: [`wishlist-check-${medicineId}`] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to check wishlist status"
                };
            }

            return data;
        } catch (error) {
            console.error("Check wishlist error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    }
};