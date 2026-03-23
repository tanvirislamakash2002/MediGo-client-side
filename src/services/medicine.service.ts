import { env } from "@/env";
import { GetMedicinesParams, MedicineData } from "@/types/medicine.type";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = env.API_URL;

export const medicineService = {
    getMedicines: async (params?: GetMedicinesParams) => {
        try {
            const url = new URL(`${API_URL}/medicine`)
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        url.searchParams.append(key, value)
                    }
                })
            }
            console.log(url);
            const res = await fetch(url.toString(),
                // {cache:'no-store'}
                // { next: { revalidate: 10 } }
                { next: { tags: ["medicine"] } }
            )
            const data = await res.json()
            return { data, error: null }
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: 'Something went wrong' } }
        }
    },
    getMedicineById: async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/medicine/${id}`)
            const data = await res.json()
            return { data, error: null }

        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } }

        }
    },
    addMedicine: async (medicineData: MedicineData) => {
        try {
            const cookieStore = await cookies()
            const res = await fetch(`${API_URL}/medicine`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(medicineData)
            })
            const data = await res.json()
            if (data.error) {
                return {
                    data: null,
                    error: { message: "Error:Medicine Is not Added" }
                }
            }
            return { data, error: null }


        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } }

        }
    },
        updateMedicine: async (id: string, medicineData: MedicineData) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/medicine/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify(medicineData)
            });
            const data = await res.json();
            if (data.error) {
                return {
                    data: null,
                    error: { message: "Error: Medicine could not be updated" }
                };
            }
            console.log(data);
            return { data, error: null };
        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } };
        }
    }
}