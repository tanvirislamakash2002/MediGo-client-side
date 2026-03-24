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
import { cartStore } from "@/lib/cart-store";
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
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data, error } = await getSession();
                setIsAuthenticated(!!data && !error);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Fetch cart from server
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            const { data, error } = await getCartItems();
            if (error) {
                console.error("Failed to fetch cart:", error);
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

    // Fetch cart count
    const fetchCartCount = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            const { data } = await getCartCount();
            setCartCount(data || 0);
        } catch (error) {
            console.error("Failed to fetch cart count:", error);
        }
    }, [isAuthenticated]);

    // Load cart when auth changes
    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated) {
            fetchCart();
        } else {
            // Load from localStorage for guests
            const guestCart = cartStore.getCart();
            const formattedCart: CartItem[] = guestCart.map((item, index) => ({
                id: `guest-${index}`,
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
        }
    }, [isAuthenticated, isLoading, fetchCart]);

    // Add to cart
    const addToCart = useCallback(async (medicineId: string, quantity: number = 1, medicineDetails?: any) => {
        setIsAdding(true);
        
        try {
            const result = await addToCartAction(medicineId, quantity);
            
            if (result.error) {
                toast.error(result.error.message);
                return false;
            }
            
            if (isAuthenticated) {
                await fetchCartCount();
                await fetchCart();
                toast.success(`Added to cart`);
            } else {
                // Guest user
                if (result.data) {
                    const guestItem = result.data as GuestCartItem;
                    const newCart = cartStore.addItem(guestItem);
                    const formattedCart: CartItem[] = newCart.map((item, index) => ({
                        id: `guest-${index}`,
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
                    toast.success(`Added ${quantity} x ${result.data.name} to cart`);
                }
            }
            
            return true;
        } catch (error) {
            toast.error("Failed to add to cart");
            return false;
        } finally {
            setIsAdding(false);
        }
    }, [isAuthenticated, fetchCart, fetchCartCount]);

    // Update cart item
    const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
        if (!isAuthenticated) return;
        
        setIsUpdating(true);
        try {
            const { error } = await updateCartItemAction(itemId, quantity);
            
            if (error) {
                toast.error(error.message);
                return;
            }
            
            await fetchCart();
            toast.success("Cart updated");
        } catch (error) {
            toast.error("Failed to update cart");
        } finally {
            setIsUpdating(false);
        }
    }, [isAuthenticated, fetchCart]);

    // Remove cart item
    const removeCartItem = useCallback(async (itemId: string) => {
        if (!isAuthenticated) return;
        
        try {
            const { error } = await removeCartItemAction(itemId);
            
            if (error) {
                toast.error(error.message);
                return;
            }
            
            await fetchCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    }, [isAuthenticated, fetchCart]);

    // Clear cart
    const clearCart = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            const { error } = await clearCartAction();
            
            if (error) {
                toast.error(error.message);
                return;
            }
            
            await fetchCart();
            toast.success("Cart cleared");
        } catch (error) {
            toast.error("Failed to clear cart");
        }
    }, [isAuthenticated, fetchCart]);

    return {
        cart,
        cartCount,
        isAdding,
        isUpdating,
        isLoading,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        isAuthenticated,
        refreshCart: fetchCart
    };
}