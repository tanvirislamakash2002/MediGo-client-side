"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

// Get cart items - use userService to get session
export const getCartItems = async () => {
    const { data: session, error: sessionError } = await userService.getSession();
    // console.log(await userService.getSession());
    if (sessionError || !session) {
        // Not logged in - return empty cart for guest
        return { data: { items: [], totalItems: 0, totalPrice: 0 }, error: null };
    }
    
    const sessionToken = session?.sessionToken; // Adjust based on your session structure
    return await cartService.getCartItems(sessionToken);
};

export const addToCart = async (medicineId: string, quantity: number) => {
    const { data: session, error: sessionError } = await userService.getSession();
    if (sessionError || !session) {
        // Guest user - let cartService handle guest flow
        return await cartService.addToCart(medicineId, quantity);
    }
    
    const sessionToken = session?.session.token;
    const result = await cartService.addToCart(medicineId, quantity, sessionToken);
    updateTag("cart");
    revalidatePath("/cart");
    revalidatePath("/shop");
    return result;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
    const { data: session, error: sessionError } = await userService.getSession();
    
    if (sessionError || !session) {
        return { data: null, error: { message: "Please login to update cart" } };
    }
    
    const result = await cartService.updateCartItem(itemId, quantity);
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const removeCartItem = async (itemId: string) => {
    const { data: session, error: sessionError } = await userService.getSession();
    
    if (sessionError || !session) {
        return { data: null, error: { message: "Please login to remove items" } };
    }
    
    const result = await cartService.removeCartItem(itemId);
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const clearCart = async () => {
    const { data: session, error: sessionError } = await userService.getSession();
    
    if (sessionError || !session) {
        return { data: null, error: { message: "Please login to clear cart" } };
    }
    
    const result = await cartService.clearCart();
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const mergeCart = async (guestCartItems: any[]) => {
    const { data: session, error: sessionError } = await userService.getSession();
    
    if (sessionError || !session) {
        return { data: null, error: { message: "Please login to merge cart" } };
    }
    
    const result = await cartService.mergeCart(guestCartItems);
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const getCartCount = async () => {
    const { data: session, error: sessionError } = await userService.getSession();
    
    if (sessionError || !session) {
        return { data: 0, error: null };
    }
    
    return await cartService.getCartCount();
};