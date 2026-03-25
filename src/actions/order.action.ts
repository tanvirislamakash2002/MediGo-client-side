"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

export const placeOrder = async (orderData: any) => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        
        if (!res.ok) {
            return { data: null, error: { message: data.message || "Failed to place order" } };
        }
        
        updateTag("cart");
        return { data: data.data, error: null };
    } catch (error) {
        console.error("Place order error:", error);
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const getSelectedCartItems = async () => {
    try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/cart/selected`, {
            headers: {
                Cookie: cookieStore.toString()
            },
            next: { tags: ["cart"] }
        });
        const data = await res.json();
        
        if (!res.ok) {
            return { data: null, error: { message: data.message || "Failed to fetch cart" } };
        }
        
        return { data: data.data, error: null };
    } catch (error) {
        return { data: null, error: { message: "Something went wrong" } };
    }
};