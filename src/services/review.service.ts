// services/review.service.ts
import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const reviewService = {
    // Create a review
    createReview: async (medicineId: string, rating: number, comment: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ medicineId, rating, comment })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to submit review"
                };
            }

            return data;
        } catch (error) {
            console.error("Create review error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get my reviews
    getMyReviews: async (page: number = 1, limit: number = 10) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/my-reviews?page=${page}&limit=${limit}`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["my-reviews"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch reviews"
                };
            }

            return data;
        } catch (error) {
            console.error("Get my reviews error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Delete a review
    deleteReview: async (reviewId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
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

            return data;
        } catch (error) {
            console.error("Delete review error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get reviews for a medicine
    getMedicineReviews: async (medicineId: string, page: number = 1, limit: number = 10) => {
        try {
            const res = await fetch(`${API_URL}/reviews/medicine/${medicineId}?page=${page}&limit=${limit}`, {
                next: { tags: [`medicine-reviews-${medicineId}`] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch reviews"
                };
            }

            return data;
        } catch (error) {
            console.error("Get medicine reviews error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get medicine rating summary
    getMedicineRating: async (medicineId: string) => {
        try {
            const res = await fetch(`${API_URL}/reviews/medicine/${medicineId}/rating`, {
                next: { tags: [`medicine-rating-${medicineId}`] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch rating"
                };
            }

            return data;
        } catch (error) {
            console.error("Get medicine rating error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },
    getUserReviewsForOrder: async (medicineIds: string[]) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/user/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ medicineIds }),
                next: { tags: ["my-reviews"] }
            });
            console.log(`${API_URL}/reviews/user/order`);
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch reviews"
                };
            }

            return data;
        } catch (error) {
            console.error("Get user reviews for order error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },
};