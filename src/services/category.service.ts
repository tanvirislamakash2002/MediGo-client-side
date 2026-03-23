import { env } from "@/env";

const API_URL = env.API_URL;

interface GetMedicinesParams {
    search?: string;
    minPrice?: string;
}

export const categoryService = {
    getCategory: async (params?: GetMedicinesParams) => {
        try {
            const url = new URL(`${API_URL}/category`)

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
    getCategoryById: async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/category/${id}`)
            const data = await res.json()
            return { data, error: null }

        } catch (error) {
            return { data: null, error: { message: 'Something went wrong' } }

        }
    }
}