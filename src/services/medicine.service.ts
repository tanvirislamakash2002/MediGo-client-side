import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface GetMedicinesParams {
    search?: string;
    minPrice?: string;
}

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
                { next: { revalidate: 10 } }
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
    }
}