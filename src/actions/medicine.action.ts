"use server"
import { medicineService } from "@/services/medicine.service"
import { MedicineData } from "@/types/medicine.type"
import { revalidateTag, updateTag } from "next/cache"
import { redirect } from "next/navigation"

export const getMedicines = async ({ search, page, limit }: {
    search: string,
    page: number,
    limit: number
}) => {
    return await medicineService.getMedicines({ search, page, limit })
}
export const addMedicine = async (medicineData: MedicineData) => {
    const res = await medicineService.addMedicine(medicineData)
    // revalidateTag('medicine', 'max')
    updateTag('medicine')
    // redirect('/seller/medicines/add?success')
    return res;
}