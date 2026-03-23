"use server"
import { categoryService } from "@/services/category.service"

export const getCategory = async () => {
    return await categoryService.getCategory()
}