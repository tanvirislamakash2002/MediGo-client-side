import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface GuestCartItem {
    medicineId: string;
    quantity: number;
    name: string;
    price: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
    stock: number;
}

export const cartService = {
    // Get cart items - automatically gets session from cookies
    getCartItems: async (sessionToken?: string) => {
        try {
            if (sessionToken) {
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/cart`, {
                    headers: { Cookie: cookieStore.toString() },
                    next: { tags: ["cart"] }
                });
                const data = await res.json();

                if (!res.ok) {
                    return { 
                        success: false, 
                        message: data.message || "Failed to fetch cart" 
                    };
                }

                return { 
                    success: true, 
                    data: data.data || data 
                };
            }
            // For guest users, return empty
            else {
                return { 
                    success: true, 
                    data: { items: [], totalItems: 0, totalPrice: 0 } 
                };
            }
        } catch (error) {
            console.error("Get cart error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    },

    // Add item to cart
    addToCart: async (medicineId: string, quantity: number, sessionToken?: string) => {
        try {
            if (sessionToken) {
                const cookieStore = await cookies();
                const res = await fetch(`${API_URL}/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: cookieStore.toString()
                    },
                    body: JSON.stringify({ medicineId, quantity })
                });
                const data = await res.json();
                
                if (!res.ok) {
                    return { 
                        success: false, 
                        message: data.message || "Failed to add to cart" 
                    };
                }

                return { 
                    success: true, 
                    data: data.data || data 
                };
            }
            // Guest user flow
            else {
                const medicineRes = await fetch(`${API_URL}/medicine/${medicineId}`);
                const medicine = await medicineRes.json();

                if (!medicineRes.ok) {
                    return { 
                        success: false, 
                        message: "Medicine not found" 
                    };
                }

                const cartItem: GuestCartItem = {
                    medicineId: medicine.id,
                    quantity,
                    name: medicine.name,
                    price: medicine.price,
                    manufacturer: medicine.manufacturer,
                    imageUrl: medicine.imageUrl,
                    requiresPrescription: medicine.requiresPrescription,
                    stock: medicine.stock
                };

                return { 
                    success: true, 
                    data: cartItem 
                };
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    },

    // Update cart item quantity
    updateCartItem: async (itemId: string, quantity: number) => {
        try {
            const cookieStore = await cookies();
            const sessionToken = cookieStore.get("session-token")?.value;

            if (!sessionToken) {
                return { 
                    success: false, 
                    message: "Please login to update cart" 
                };
            }

            const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ quantity })
            });
            const data = await res.json();

            if (!res.ok) {
                return { 
                    success: false, 
                    message: data.message || "Failed to update cart" 
                };
            }

            return { 
                success: true, 
                data: data.data || data 
            };
        } catch (error) {
            console.error("Update cart error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    },

    // Remove item from cart
    removeCartItem: async (itemId: string) => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();
            
            if (!res.ok) {
                return { 
                    success: false, 
                    message: data.message || "Failed to remove item" 
                };
            }

            return { 
                success: true, 
                data: data.data || data 
            };
        } catch (error) {
            console.error("Remove cart error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    },

    // Clear entire cart
    clearCart: async () => {
        try {
            const cookieStore = await cookies();
            const sessionToken = cookieStore.get("session-token")?.value;

            if (!sessionToken) {
                return { 
                    success: false, 
                    message: "Please login to clear cart" 
                };
            }

            const res = await fetch(`${API_URL}/cart`, {
                method: "DELETE",
                headers: { Cookie: cookieStore.toString() }
            });
            const data = await res.json();

            if (!res.ok) {
                return { 
                    success: false, 
                    message: data.message || "Failed to clear cart" 
                };
            }

            return { 
                success: true, 
                data: data.data || data 
            };
        } catch (error) {
            console.error("Clear cart error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    },

    // Merge guest cart with user cart on login
    mergeCart: async (guestCartItems: GuestCartItem[]) => {
        try {
            const cookieStore = await cookies();
            const sessionToken = cookieStore.get("session-token")?.value;

            if (!sessionToken) {
                return { 
                    success: false, 
                    message: "Please login to merge cart" 
                };
            }

            const res = await fetch(`${API_URL}/cart/merge`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ items: guestCartItems })
            });
            const data = await res.json();

            if (!res.ok) {
                return { 
                    success: false, 
                    message: data.message || "Failed to merge cart" 
                };
            }

            return { 
                success: true, 
                data: data.data || data 
            };
        } catch (error) {
            console.error("Merge cart error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    },

    // Get cart count
    getCartCount: async () => {
        try {
            const cookieStore = await cookies();
            const sessionToken = cookieStore.get("session-token")?.value;

            if (sessionToken) {
                const res = await fetch(`${API_URL}/cart/count`, {
                    headers: { Cookie: cookieStore.toString() },
                    next: { tags: ["cart-count"] }
                });
                const data = await res.json();

                if (!res.ok) {
                    return { 
                        success: true, 
                        data: 0 
                    };
                }

                return { 
                    success: true, 
                    data: data.data || data.count || 0 
                };
            }

            return { 
                success: true, 
                data: 0 
            };
        } catch (error) {
            console.error("Get cart count error:", error);
            return { 
                success: true, 
                data: 0 
            };
        }
    },

    // Get selected cart items by IDs
    getSelectedCartItems: async (sessionToken: string, selectedItemIds: string[]) => {
        try {
            if (!sessionToken) {
                return { 
                    success: false, 
                    message: "Please login to view cart" 
                };
            }

            const cookieStore = await cookies();
            const res = await fetch(`${API_URL}/cart/selected`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: cookieStore.toString()
                },
                body: JSON.stringify({ itemIds: selectedItemIds })
            });
            const data = await res.json();

            if (!res.ok) {
                return { 
                    success: false, 
                    message: data.message || "Failed to fetch selected items" 
                };
            }

            return { 
                success: true, 
                data: data.data || data 
            };
        } catch (error) {
            console.error("Get selected cart items error:", error);
            return { 
                success: false, 
                message: "Something went wrong" 
            };
        }
    }
};