"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.API_URL || "http://localhost:5000/api/v1";

export const placeOrder = async (orderData: any) => {
    try {

        
        const cookieStore = await cookies();

        
        const res = await fetch(`${API_URL}/order`, {
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
        return { data: null, error: { message: "Something went wrong" } };
    }
};
// Fix: Accept itemIds parameter and send to backend
export const getSelectedCartItems = async (itemIds: string[]) => {
    try {
        if (!itemIds || itemIds.length === 0) {
            return { data: null, error: { message: "No items selected" } };
        }
        
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/cart/selected`, {
            method: "POST",  // Changed to POST to send data
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            body: JSON.stringify({ itemIds })  // Send item IDs in body
        });
        const data = await res.json();
        
        if (!res.ok) {
            return { data: null, error: { message: data.message || "Failed to fetch cart" } };
        }
        
        return { data: data.data, error: null };
    } catch (error) {
        console.error("Get selected cart items error:", error);
        return { data: null, error: { message: "Something went wrong" } };
    }
};

export const getMyOrders = async (params?: {
    status?: string;
    statuses?: string[];
    search?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
    sort?: string;
    page?: number;
    limit?: number;
}) => {
    try {
        const cookieStore = await cookies();
        const url = new URL(`${API_URL}/order`);
        
        // Add filters to URL
        if (params?.status && params.status !== "all") {
            url.searchParams.append("status", params.status);
        }
        
        if (params?.statuses && params.statuses.length > 0) {
            url.searchParams.append("statuses", params.statuses.join(","));
        }
        
        if (params?.search) {
            url.searchParams.append("search", params.search);
        }
        
        if (params?.fromDate) {
            url.searchParams.append("fromDate", params.fromDate);
        }
        
        if (params?.toDate) {
            url.searchParams.append("toDate", params.toDate);
        }
        
        if (params?.minAmount !== undefined) {
            url.searchParams.append("minAmount", params.minAmount.toString());
        }
        
        if (params?.maxAmount !== undefined) {
            url.searchParams.append("maxAmount", params.maxAmount.toString());
        }
        
        if (params?.sort) {
            let sortBy = "createdAt";
            let sortOrder = "desc";
            
            switch (params.sort) {
                case "newest":
                    sortBy = "createdAt";
                    sortOrder = "desc";
                    break;
                case "oldest":
                    sortBy = "createdAt";
                    sortOrder = "asc";
                    break;
                case "highest":
                    sortBy = "totalAmount";
                    sortOrder = "desc";
                    break;
                case "lowest":
                    sortBy = "totalAmount";
                    sortOrder = "asc";
                    break;
                default:
                    sortBy = "createdAt";
                    sortOrder = "desc";
            }
            
            url.searchParams.append("sortBy", sortBy);
            url.searchParams.append("sortOrder", sortOrder);
        }
        
        if (params?.page) {
            url.searchParams.append("page", params.page.toString());
        }
        
        if (params?.limit) {
            url.searchParams.append("limit", params.limit.toString());
        }
        
        const res = await fetch(url.toString(), {
            headers: {
                Cookie: cookieStore.toString()
            },
            next: { tags: ["orders"] }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            return { data: null, error: { message: data.message || "Failed to fetch orders" } };
        }
        
        return { data: data.data, error: null };
    } catch (error) {
        console.error("Get orders error:", error);
        return { data: null, error: { message: "Something went wrong" } };
    }
};