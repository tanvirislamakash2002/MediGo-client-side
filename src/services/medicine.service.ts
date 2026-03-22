import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const medicineService = {
    getMedicines: async () => {
        try {
            const res = await fetch(`${API_URL}/medicine`)
            const data = await res.json()
            return { data, error: null }
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: 'Something went wrong' } }
        }
    }
}