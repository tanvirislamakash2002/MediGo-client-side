"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getCartItems,
    addToCart as addToCartAction,
    updateCartItem as updateCartItemAction,
    removeCartItem as removeCartItemAction,
    clearCart as clearCartAction,
} from "@/actions/cart.action";
import { getSession } from "@/actions/auth.action";
import { cartStore } from "@/lib/guest-cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCart } from "@/redux/features/cart/cart.slice";
import { ICartItem } from "@/redux/features/cart/cart.type";

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
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Redux store is the single source of truth for cart items
    const cart = useAppSelector((state) => state.cart.items);

    // Derived values computed directly from Redux state
    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );
    const cartCount = useMemo(
        () => cart.reduce((count, item) => count + item.quantity, 0),
        [cart]
    );

    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data, success } = await getSession();
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

    // Fetch cart from server and sync to Redux
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const { data, success, message } = await getCartItems();
            if (!success) {
                console.error("Failed to fetch cart:", message);
                return;
            }
            if (data?.items) {
                dispatch(setCart(data.items));
            }
        } catch (error) {
            console.error("Failed to load cart:", error);
        }
    }, [isAuthenticated, dispatch]);

    // Load guest cart from localStorage and sync to Redux
    const loadGuestCart = useCallback(() => {
        const guestCart = cartStore.getCart();
        const formattedCart: ICartItem[] = guestCart.map((item) => ({
            id: `guest-${item.medicineId}`,
            medicineId: item.medicineId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            stock: item.stock,
            manufacturer: item.manufacturer,
            imageUrl: item.imageUrl,
            requiresPrescription: item.requiresPrescription,
        }));
        dispatch(setCart(formattedCart));
    }, [dispatch]);

    // Load cart when auth changes
    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated) {
            fetchCart();
        } else {
            loadGuestCart();
        }
    }, [isAuthenticated, isLoading, fetchCart, loadGuestCart]);

    // Remove cart item
    const removeCartItem = useCallback(
        async (itemId: string) => {
            if (isAuthenticated) {
                try {
                    const result = await removeCartItemAction(itemId);
                    if (!result.success) {
                        toast.error(result.message);
                        return;
                    }
                    await fetchCart();
                    router.refresh();
                    toast.success("Item removed from cart");
                } catch (error) {
                    toast.error("Failed to remove item");
                }
            } else {
                const medicineId = itemId.replace("guest-", "");
                cartStore.removeItem(medicineId);
                loadGuestCart();
                router.refresh();
                toast.success("Item removed from cart");
            }
        },
        [isAuthenticated, fetchCart, loadGuestCart, router]
    );

    // Update cart item
    const updateCartItem = useCallback(
        async (itemId: string, quantity: number) => {
            if (quantity <= 0) {
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
                    router.refresh();
                    toast.success("Cart updated");
                } catch (error) {
                    toast.error("Failed to update cart");
                } finally {
                    setIsUpdating(false);
                }
            } else {
                const medicineId = itemId.replace("guest-", "");
                cartStore.updateQuantity(medicineId, quantity);
                loadGuestCart();
                router.refresh();
                toast.success("Cart updated");
            }
        },
        [isAuthenticated, fetchCart, loadGuestCart, removeCartItem, router]
    );

    // Add to cart
    const addToCart = useCallback(
        async (medicineId: string, quantity: number = 1) => {
            setIsAdding(true);

            try {
                const result = await addToCartAction(medicineId, quantity);

                if (!result.success) {
                    toast.error(result.message);
                    return false;
                }

                if (isAuthenticated) {
                    await fetchCart();
                    router.refresh();
                    toast.success(`Added to cart`);
                } else {
                    // Guest user - result.data contains the medicine details
                    if (result.data) {
                        if (!result.data.medicineId || !result.data.name) {
                            console.error("Invalid guest item data:", result.data);
                            toast.error("Failed to add item to cart");
                            return false;
                        }

                        const guestItem = result.data as GuestCartItem;
                        cartStore.addItem(guestItem);
                        loadGuestCart();
                        router.refresh();
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
        },
        [isAuthenticated, fetchCart, loadGuestCart, router]
    );

    // Clear cart
    const clearCart = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const result = await clearCartAction();
                if (!result.success) {
                    toast.error(result.message);
                    return;
                }
                dispatch(setCart([]));
                router.refresh();
                toast.success("Cart cleared");
            } catch (error) {
                toast.error("Failed to clear cart");
            }
        } else {
            cartStore.clearCart();
            dispatch(setCart([]));
            router.refresh();
            toast.success("Cart cleared");
        }
    }, [isAuthenticated, dispatch, router]);

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
        refreshCart,
    };
}
