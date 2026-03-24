"use server";

import { categoryService } from "@/services/category.service";
import { updateTag } from "next/cache";

// Get all categories
export const getCategories = async () => {
    return await categoryService.getCategories();
};

// Get single category by ID
export const getCategoryById = async (id: string) => {
    return await categoryService.getCategoryById(id);
};

// Create category (Admin only)
export const createCategory = async (data: { name: string; description?: string }) => {
    const result = await categoryService.createCategory(data);
    updateTag("categories");
    return result;
};

// Update category (Admin only)
export const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
    const result = await categoryService.updateCategory(id, data);
    updateTag("categories");
    return result;
};

// Delete category (Admin only)
export const deleteCategory = async (id: string) => {
    const result = await categoryService.deleteCategory(id);
    updateTag("categories");
    return result;
};