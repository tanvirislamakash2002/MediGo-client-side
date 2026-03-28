"use server"
import { medicineService } from "@/services/medicine.service"
import { GetMedicinesParams, MedicineData } from "@/types/medicine.type"
import {  updateTag } from "next/cache"

export const getMedicines = async (params?: GetMedicinesParams) => {
    return await medicineService.getMedicines(params);
};

export const getSellerMedicines = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
}) => {
    return await medicineService.getSellerMedicines(params);
};

export const addMedicine = async (medicineData: MedicineData) => {
    const res = await medicineService.addMedicine(medicineData)
    updateTag('medicine')
    return res;
}

export const getMedicineById = async (id: string) => {
    return await medicineService.getMedicineById(id);
};

export const updateMedicine = async (id: string, medicineData: MedicineData) => {
    const res = await medicineService.updateMedicine(id, medicineData);
    updateTag('medicine');
    return res;
};

export const deleteMedicine = async (id: string) => {
    const res = await medicineService.deleteMedicine(id);
    updateTag('medicine'); 
    return res;
};