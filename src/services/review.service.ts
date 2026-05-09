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
    updateReview: async (reviewId: string, rating: number, comment: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ rating, comment })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to update review"
                };
            }

            return data;
        } catch (error) {
            console.error("Update review error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },
    getSellerReviews: async (params?: any) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/reviews/seller`);

            if (params?.rating) url.searchParams.append("rating", params.rating);
            if (params?.productId) url.searchParams.append("productId", params.productId);
            if (params?.dateRange) url.searchParams.append("dateRange", params.dateRange);
            if (params?.responded) url.searchParams.append("responded", params.responded);
            if (params?.search) url.searchParams.append("search", params.search);
            if (params?.sort) url.searchParams.append("sort", params.sort);
            if (params?.page) url.searchParams.append("page", params.page.toString());
            if (params?.limit) url.searchParams.append("limit", params.limit.toString());

            const res = await fetch(url.toString(), {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-reviews"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || "Failed to fetch reviews" };
            }
            return data;
        } catch (error) {
            console.error("Get seller reviews error:", error);
            return { success: false, message: "Something went wrong" };
        }
    },

    getSellerReviewStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/seller/stats`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-reviews"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || "Failed to fetch stats" };
            }
            return data;
        } catch (error) {
            console.error("Get seller review stats error:", error);
            return { success: false, message: "Something went wrong" };
        }
    },

    respondToReview: async (reviewId: string, response: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/${reviewId}/respond`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ response })
            });
            const data = await res.json();

            if (!res.ok) {
                return { success: false, message: data.message || "Failed to submit response" };
            }
            return data;
        } catch (error) {
            console.error("Respond to review error:", error);
            return { success: false, message: "Something went wrong" };
        }
    },

    // Get all reviews for admin with filters
    getAllReviewsForAdmin: async (params?: {
        status?: string;
        rating?: string;
        dateRange?: string;
        sellerId?: string;
        search?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/reviews/admin/reviews`);

            if (params?.status && params.status !== "all") {
                url.searchParams.append("status", params.status);
            }
            if (params?.rating && params.rating !== "all") {
                url.searchParams.append("rating", params.rating);
            }
            if (params?.dateRange && params.dateRange !== "all") {
                url.searchParams.append("dateRange", params.dateRange);
            }
            if (params?.sellerId && params.sellerId !== "all") {
                url.searchParams.append("sellerId", params.sellerId);
            }
            if (params?.search) {
                url.searchParams.append("search", params.search);
            }
            if (params?.sort) {
                url.searchParams.append("sort", params.sort);
            }
            if (params?.page) {
                url.searchParams.append("page", params.page.toString());
            }
            if (params?.limit) {
                url.searchParams.append("limit", params.limit.toString());
            }

            const res = await fetch(url.toString(), {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["admin-reviews"] }
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
            console.error("Get all reviews for admin error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Get admin review statistics
    getAdminReviewStats: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/admin/stats`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["admin-reviews"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to fetch review statistics"
                };
            }

            return data;
        } catch (error) {
            console.error("Get admin review stats error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Update review status (approve/suspend)
    updateReviewStatus: async (reviewId: string, status: string, suspendReason?: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/admin/reviews/${reviewId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ status, suspendReason })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to update review status"
                };
            }

            return data;
        } catch (error) {
            console.error("Update review status error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },

    // Bulk update review status
    bulkUpdateReviewStatus: async (reviewIds: string[], status: string, suspendReason?: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/reviews/admin/reviews/bulk`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ reviewIds, status, suspendReason })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Failed to update review statuses"
                };
            }

            return data;
        } catch (error) {
            console.error("Bulk update review status error:", error);
            return {
                success: false,
                message: "Something went wrong"
            };
        }
    },
};