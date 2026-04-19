"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getCartItems,
    addToCart as addToCartAction,
    updateCartItem as updateCartItemAction,
    removeCartItem as removeCartItemAction,
    clearCart as clearCartAction,
    getCartCount
} from "@/actions/cart.action";
import { getSession } from "@/actions/auth.action";
import { cartStore } from "@/lib/guest-cart";
import { toast } from "sonner";

interface CartItem {
    id: string;
    medicineId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
}

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

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data, success } = await getSession();
                // ✅ Fix: Check if session exists and success is true
                setIsAuthenticated(!!data && success === true);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Calculate cart total
    useEffect(() => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cart]);

    // Fetch cart from server
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const { data, success, message } = await getCartItems();
            if (!success) {
                console.error("Failed to fetch cart:", message);
                return;
            }
            if (data?.items) {
                setCart(data.items);
                setCartCount(data.totalItems || 0);
            }
        } catch (error) {
            console.error("Failed to load cart:", error);
        }
    }, [isAuthenticated]);

    // Load guest cart
    const loadGuestCart = useCallback(() => {
        const guestCart = cartStore.getCart();
        const formattedCart: CartItem[] = guestCart.map((item, index) => ({
            id: `guest-${item.medicineId}`, // ✅ Better ID using medicineId
            medicineId: item.medicineId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            stock: item.stock,
            manufacturer: item.manufacturer,
            imageUrl: item.imageUrl,
            requiresPrescription: item.requiresPrescription
        }));
        setCart(formattedCart);
        setCartCount(cartStore.getCartCount());
    }, []);

    // Load cart when auth changes
    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated) {
            fetchCart();
        } else {
            loadGuestCart();
        }
    }, [isAuthenticated, isLoading, fetchCart, loadGuestCart]);

    // Add to cart
    const addToCart = useCallback(async (medicineId: string, quantity: number = 1) => {
        setIsAdding(true);

        try {
            const result = await addToCartAction(medicineId, quantity);

            // ✅ Debug log
            console.log("Add to cart result:", JSON.stringify(result, null, 2));

            if (!result.success) {
                toast.error(result.message);
                return false;
            }

            if (isAuthenticated) {
                await fetchCart();
                toast.success(`Added to cart`);
            } else {
                // Guest user - result.data contains the medicine details
                if (result.data) {
                    console.log("Guest item data:", result.data); // ✅ Debug log

                    // ✅ Validate data before adding
                    if (!result.data.medicineId || !result.data.name) {
                        console.error("Invalid guest item data:", result.data);
                        toast.error("Failed to add item to cart");
                        return false;
                    }

                    const guestItem = result.data as GuestCartItem;
                    cartStore.addItem(guestItem);
                    loadGuestCart();
                    toast.success(`Added ${quantity} x ${result.data.name} to cart`);
                } else {
                    console.error("No data in result for guest user");
                    toast.error("Failed to add item to cart");
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error("Add to cart error:", error);
            toast.error("Failed to add to cart");
            return false;
        } finally {
            setIsAdding(false);
        }
    }, [isAuthenticated, fetchCart, loadGuestCart]);

    // Update cart item
    const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            // If quantity is 0 or negative, remove the item
            await removeCartItem(itemId);
            return;
        }

        if (isAuthenticated) {
            setIsUpdating(true);
            try {
                const result = await updateCartItemAction(itemId, quantity);
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                await fetchCart();
                toast.success("Cart updated");
            } catch (error) {
                toast.error("Failed to update cart");
            } finally {
                setIsUpdating(false);
            }
        } else {
            // ✅ Guest user - update localStorage
            // For guest, itemId is actually medicineId (since we used medicineId as id)
            const medicineId = itemId.replace("guest-", "");
            cartStore.updateQuantity(medicineId, quantity);
            loadGuestCart();
            toast.success("Cart updated");
        }
    }, [isAuthenticated, fetchCart, loadGuestCart]);

    // Remove cart item
    const removeCartItem = useCallback(async (itemId: string) => {
        if (isAuthenticated) {
            try {
                const result = await removeCartItemAction(itemId);
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                await fetchCart();
                toast.success("Item removed from cart");
            } catch (error) {
                toast.error("Failed to remove item");
            }
        } else {
            // ✅ Guest user - remove from localStorage
            const medicineId = itemId.replace("guest-", "");
            cartStore.removeItem(medicineId);
            loadGuestCart();
            toast.success("Item removed from cart");
        }
    }, [isAuthenticated, fetchCart, loadGuestCart]);

    // Clear cart
    const clearCart = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const result = await clearCartAction();
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                await fetchCart();
                toast.success("Cart cleared");
            } catch (error) {
                toast.error("Failed to clear cart");
            }
        } else {
            // ✅ Guest user - clear localStorage
            cartStore.clearCart();
            loadGuestCart();
            toast.success("Cart cleared");
        }
    }, [isAuthenticated, fetchCart, loadGuestCart]);

    // Refresh cart manually
    const refreshCart = useCallback(async () => {
        if (isAuthenticated) {
            await fetchCart();
        } else {
            loadGuestCart();
        }
    }, [isAuthenticated, fetchCart, loadGuestCart]);

    return {
        cart,
        cartCount,
        cartTotal,
        isAdding,
        isUpdating,
        isLoading,
        isAuthenticated,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        refreshCart
    };
}