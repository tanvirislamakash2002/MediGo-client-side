import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const uploadService = {
    upload: async (formData: FormData, endpoint: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/upload/${endpoint}`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString()
                },
                body: formData
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false,
                    message: data.message || `Failed to upload to ${endpoint}`
                };
            }
            
            // Backend returns { success: true, data: {...} }
            return data;
        } catch (error) {
            console.error(`Upload to ${endpoint} error:`, error);
            return { 
                success: false,
                message: "Something went wrong"
            };
        }
    },
};