"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getCartItems,
    addToCart as addToCartAction,
    updateCartItem as updateCartItemAction,
    removeCartItem as removeCartItemAction,
    clearCart as clearCartAction,
    mergeCart as mergeCartAction,
} from "@/actions/cart.action";
import { getSession } from "@/actions/auth.action";
import { guestCartStore } from "@/lib/guest-cart";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    setCart,
    addToCart as addToCartRedux,
    updateQuantity as updateQuantityRedux,
    removeItem as removeItemRedux,
    clearCart as clearCartRedux,
} from "@/redux/features/cart/cart.slice";
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

// Module-level singletons to prevent multi-mount network stampedes across components
let authPromise: Promise<{ isAuthenticated: boolean }> | null = null;
let isSyncingCart = false;

export function useCart() {
    const dispatch = useAppDispatch();

    // Redux store is the single source of truth for cart items and initialization
    const cart = useAppSelector((state) => state.cart.items);
    const isInitialized = useAppSelector((state) => state.cart.isInitialized);

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
    const [isLoading, setIsLoading] = useState(!isInitialized);

    // Deduplicated auth check across all mounting components
    useEffect(() => {
                let isMounted = true;

                if (!authPromise) {
                    authPromise = getSession()
                        .then(({ data, success }) => ({
                            isAuthenticated: !!data && success === true,
                        }))
                        .catch((err) => {
                            console.error("Auth check failed:", err);
                            return { isAuthenticated: false };
                        });
                }

                authPromise.then((res) => {
                    if (isMounted) {
                        setIsAuthenticated(res.isAuthenticated);
                        setIsLoading(false);
                    }
                });

                return () => {
                    isMounted = false;
                };
            }, []);

    // Load guest cart from localStorage and sync to Redux
    const loadGuestCart = useCallback(() => {
        const guestCart = guestCartStore.getCart();
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

    // Fetch cart from server and sync to Redux (auto-merges guest cart on login)
    const fetchCart = useCallback(async () => {
        if (isSyncingCart) return;
        isSyncingCart = true;

        try {
            // Check if there are orphaned guest items to merge on login
            const guestItems = guestCartStore.getCart();
            if (guestItems.length > 0) {
                try {
                    await mergeCartAction(guestItems);
                    guestCartStore.clearCart();
                } catch (mergeErr) {
                    console.error("Failed to merge guest cart:", mergeErr);
                }
            }

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
        } finally {
            isSyncingCart = false;
        }
    }, [dispatch]);

    // Initial load: Only runs if the cart has NOT been initialized yet
    useEffect(() => {
        if (isLoading || isInitialized) return;

        if (isAuthenticated) {
            fetchCart();
        } else {
            loadGuestCart();
        }
}, [isAuthenticated, isLoading, isInitialized, fetchCart, loadGuestCart]);

// Remove cart item (Optimistic update)
const removeCartItem = useCallback(
    async (itemId: string) => {
        // 1. Optimistically remove from Redux immediately (0ms UI lag)
        dispatch(removeItemRedux(itemId));

        if (isAuthenticated) {
            try {
                const result = await removeCartItemAction(itemId);
                if (!result.success) {
                    toast.error(result.message);
                    await fetchCart(); // Revert from server on failure
                    return;
                }
                toast.success("Item removed from cart");
            } catch (error) {
                toast.error("Failed to remove item");
                await fetchCart(); // Revert from server on failure
            }
        } else {
            const medicineId = itemId.replace("guest-", "");
            guestCartStore.removeItem(medicineId);
            toast.success("Item removed from cart");
        }
    },
    [isAuthenticated, dispatch, fetchCart]
);

// Update cart item quantity (Optimistic update)
const updateCartItem = useCallback(
    async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeCartItem(itemId);
            return;
        }

        // 1. Optimistically update Redux immediately (0ms UI lag)
        dispatch(updateQuantityRedux({ id: itemId, quantity }));

        if (isAuthenticated) {
            setIsUpdating(true);
            try {
                const result = await updateCartItemAction(itemId, quantity);
                if (!result.success) {
                    toast.error(result.message);
                    await fetchCart(); // Revert from server on failure
                    return;
                }
                toast.success("Cart updated");
            } catch (error) {
                toast.error("Failed to update cart");
                await fetchCart(); // Revert from server on failure
            } finally {
                setIsUpdating(false);
            }
        } else {
            const medicineId = itemId.replace("guest-", "");
            guestCartStore.updateQuantity(medicineId, quantity);
            toast.success("Cart updated");
        }
    },
    [isAuthenticated, dispatch, fetchCart, removeCartItem]
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
                // Update Redux from returned item or fetch
                if (result.data) {
                    dispatch(addToCartRedux(result.data));
                } else {
                    await fetchCart();
                }
                toast.success("Added to cart");
            } else {
                // Guest user: save to localStorage store and Redux
                if (result.data) {
                    if (!result.data.medicineId || !result.data.name) {
                        console.error("Invalid guest item data:", result.data);
                        toast.error("Failed to add item to cart");
                        return false;
                    }

                    const guestItem = result.data as GuestCartItem;
                    guestCartStore.addItem(guestItem);
                    dispatch(
                        addToCartRedux({
                            id: `guest-${guestItem.medicineId}`,
                            medicineId: guestItem.medicineId,
                            name: guestItem.name,
                            price: guestItem.price,
                            quantity,
                            stock: guestItem.stock,
                            manufacturer: guestItem.manufacturer,
                            imageUrl: guestItem.imageUrl,
                            requiresPrescription: guestItem.requiresPrescription,
                        })
                    );
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
    [isAuthenticated, dispatch, fetchCart]
);

// Clear cart (Optimistic update)
const clearCart = useCallback(async () => {
    // 1. Optimistically clear Redux store immediately
    dispatch(clearCartRedux());

    if (isAuthenticated) {
        try {
            const result = await clearCartAction();
            if (!result.success) {
                toast.error(result.message);
                await fetchCart();
                return;
            }
            toast.success("Cart cleared");
        } catch (error) {
            toast.error("Failed to clear cart");
            await fetchCart();
        }
    } else {
        guestCartStore.clearCart();
        toast.success("Cart cleared");
    }
    }, [isAuthenticated, dispatch, fetchCart]);

// Force refresh cart manually (e.g. after checkout or re-login)
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
