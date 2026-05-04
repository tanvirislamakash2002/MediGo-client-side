"use server";

import { reviewService } from "@/services/review.service";
import { updateTag } from "next/cache";

export const createReview = async (medicineId: string, rating: number, comment: string) => {
    const result = await reviewService.createReview(medicineId, rating, comment);
    if (result.success) {
        updateTag(`medicine-reviews-${medicineId}`);
        updateTag(`medicine-rating-${medicineId}`);
        updateTag("my-reviews");
    }
    return result;
};

export const getMyReviews = async (page?: number, limit?: number) => {
    return await reviewService.getMyReviews(page, limit);
};

export const deleteReview = async (reviewId: string) => {
    const result = await reviewService.deleteReview(reviewId);
    if (result.success) {
        updateTag("my-reviews");
    }
    return result;
};

export const getMedicineReviews = async (medicineId: string, page?: number, limit?: number) => {
    return await reviewService.getMedicineReviews(medicineId, page, limit);
};

export const getMedicineRating = async (medicineId: string) => {
    return await reviewService.getMedicineRating(medicineId);
};

export const getUserReviewsForOrder = async (medicineIds: string[]) => {
    return await reviewService.getUserReviewsForOrder(medicineIds);
};

export const updateReview = async (reviewId: string, rating: number, comment: string) => {
    const result = await reviewService.updateReview(reviewId, rating, comment);
    if (result.success) {
        updateTag("my-reviews");
    }
    return result;
};

export const getSellerReviews = async (params?: {
    rating?: string;
    productId?: string;
    dateRange?: string;
    responded?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}) => {
    return await reviewService.getSellerReviews(params);
};

export const getSellerReviewStats = async () => {
    return await reviewService.getSellerReviewStats();
};

export const respondToReview = async (reviewId: string, response: string) => {
    const result = await reviewService.respondToReview(reviewId, response);
    if (result.success) {
        updateTag("seller-reviews");
    }
    return result;
};

export const getAllReviewsForAdmin = async (params?: {
    status?: string;
    rating?: string;
    dateRange?: string;
    sellerId?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}) => {
    return await reviewService.getAllReviewsForAdmin(params);
};

export const getAdminReviewStats = async () => {
    return await reviewService.getAdminReviewStats();
};

export const updateReviewStatus = async (reviewId: string, status: string, rejectionReason?: string) => {
    const result = await reviewService.updateReviewStatus(reviewId, status, rejectionReason);
    if (result.success) {
        updateTag("admin-reviews");
    }
    return result;
};

export const bulkUpdateReviewStatus = async (reviewIds: string[], status: string, rejectionReason?: string) => {
    const result = await reviewService.bulkUpdateReviewStatus(reviewIds, status, rejectionReason);
    if (result.success) {
        updateTag("admin-reviews");
    }
    return result;
};

export const getAllSellers = async () => {
    return await userService.getAllSellers();
};