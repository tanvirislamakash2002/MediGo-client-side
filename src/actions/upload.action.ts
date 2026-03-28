"use server";

import { cookies } from "next/headers";
import { env } from "@/env";

const API_URL = env.API_URL;

export const uploadAvatar = async (formData: FormData) => {
    try {
        const cookieStore = await cookies();
        console.log(formData);
        const res = await fetch(`${API_URL}/upload/avatar`, {
            method: "POST",
            headers: {
                Cookie: cookieStore.toString()
            },
            body: formData
        });
        console.log(res);
        
        const data = await res.json();
        
        if (!res.ok) return { data: null, error: { message: data.message || "Failed to upload avatar" } };
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};