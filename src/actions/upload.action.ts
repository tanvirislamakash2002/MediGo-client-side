"use server";

import { uploadService } from "@/services/upload.service";
import { updateTag } from "next/cache";

// Upload avatar image
export const uploadAvatar = async (formData: FormData) => {
    const result = await uploadService.upload(formData, "avatar");
    if (result.success) {
        updateTag("profile");
        updateTag("customer-profile");
        updateTag("seller-profile");
        updateTag("admin-profile");
    }
    return result;
};

// Upload store logo (seller)
export const uploadStoreLogo = async (formData: FormData) => {
    const result = await uploadService.upload(formData, "store-logo");
    if (result.success) {
        updateTag("seller-profile");
        updateTag("seller-settings");
    }
    return result;
};

// Upload document (seller verification)
export const uploadDocument = async (formData: FormData) => {
    const result = await uploadService.upload(formData, "document");
    if (result.success) {
        updateTag("seller-documents");
    }
    return result;
};

// Upload product image (seller)
export const uploadProductImage = async (medicineId: string, formData: FormData) => {
    const result = await uploadService.upload(formData, `product-image/${medicineId}`);
    if (result.success) {
        updateTag("medicine");
    }
    return result;
};