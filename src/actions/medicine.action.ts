"use server"
import { medicineService } from "@/services/medicine.service"

export const getMedicines = async () => {
    return await medicineService.getMedicines()
}