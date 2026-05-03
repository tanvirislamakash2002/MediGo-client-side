// actions/wishlist.action.ts
"use server";

import { wishlistService } from "@/services/wishlist.service";
import { updateTag, revalidatePath } from "next/cache";

export const addToWishlist = async (medicineId: string) => {
    const result = await wishlistService.addToWishlist(medicineId);
    if (result.success) {
        updateTag("wishlist");
        updateTag(`wishlist-check-${medicineId}`);
        revalidatePath("/shop");
        revalidatePath("/wishlist");
    }
    return result;
};

export const removeFromWishlist = async (medicineId: string) => {
    const result = await wishlistService.removeFromWishlist(medicineId);
    if (result.success) {
        updateTag("wishlist");
        updateTag(`wishlist-check-${medicineId}`);
        revalidatePath("/shop");
        revalidatePath("/wishlist");
    }
    return result;
};

export const getWishlist = async (page?: number, limit?: number) => {
    return await wishlistService.getWishlist(page, limit);
};

export const checkInWishlist = async (medicineId: string) => {
    return await wishlistService.checkInWishlist(medicineId);
};