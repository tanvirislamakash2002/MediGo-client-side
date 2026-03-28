import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const orderService = {
    // Place a new order
    placeOrder: async (orderData: any) => {
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
                return {
                    data: null,
                    error: { message: data.message || "Failed to place order" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Place order error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Get selected cart items for checkout
    getSelectedCartItems: async (itemIds: string[]) => {
        try {
            if (!itemIds || itemIds.length === 0) {
                return { data: null, error: { message: "No items selected" } };
            }

            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/cart/selected`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ itemIds })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to fetch cart" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Get selected cart items error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Get customer orders
    getMyOrders: async (params?: {
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
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["orders"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to fetch orders" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Get orders error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Get order by ID
    getOrderById: async (orderId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/order/${orderId}`, {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: [`order-${orderId}`] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to fetch order" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Get order error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Cancel order
    cancelOrder: async (orderId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/order/${orderId}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to cancel order" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Cancel order error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Get seller orders
    getSellerOrders: async (params?: {
        status?: string;
        search?: string;
        sort?: string;
        page?: number;
        fromDate?: string;
        toDate?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/order/seller/orders`);

            if (params?.status && params.status !== "all") {
                url.searchParams.append("status", params.status);
            }
            if (params?.search) {
                url.searchParams.append("search", params.search);
            }
            if (params?.sort) {
                url.searchParams.append("sort", params.sort);
            }
            if (params?.page) {
                url.searchParams.append("page", params.page.toString());
            }
            if (params?.fromDate) {
                url.searchParams.append("fromDate", params.fromDate);
            }
            if (params?.toDate) {
                url.searchParams.append("toDate", params.toDate);
            }

            const res = await fetch(url.toString(), {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["seller-orders"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to fetch orders" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Get seller orders error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Update order status
    updateOrderStatus: async (orderId: string, status: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/order/seller/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to update order status" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Update order status error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Get all orders
    getAllOrders: async (params?: {
        status?: string;
        search?: string;
        sort?: string;
        page?: number;
        fromDate?: string;
        toDate?: string;
    }) => {
        try {
            const cookieStore = await cookies();
            const url = new URL(`${API_URL}/order/admin/orders`);

            if (params?.status && params.status !== "all") {
                url.searchParams.append("status", params.status);
            }
            if (params?.search) {
                url.searchParams.append("search", params.search);
            }
            if (params?.sort) {
                url.searchParams.append("sort", params.sort);
            }
            if (params?.page) {
                url.searchParams.append("page", params.page.toString());
            }
            if (params?.fromDate) {
                url.searchParams.append("fromDate", params.fromDate);
            }
            if (params?.toDate) {
                url.searchParams.append("toDate", params.toDate);
            }

            const res = await fetch(url.toString(), {
                headers: { Cookie: cookieStore.toString() },
                next: { tags: ["admin-orders"] }
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to fetch orders" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Get all orders error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Update order status
    adminUpdateOrderStatus: async (orderId: string, status: string, reason?: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/order/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ status, reason })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to update order status" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Admin update order status error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },

    // Cancel order
    adminCancelOrder: async (orderId: string, reason?: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/order/admin/orders/${orderId}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ reason })
            });
            const data = await res.json();

            if (!res.ok) {
                return {
                    data: null,
                    error: { message: data.message || "Failed to cancel order" }
                };
            }

            return { data: data.data, error: null };
        } catch (error) {
            console.error("Admin cancel order error:", error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    },
};