"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cartService } from "@/services/cart.service";
import { userService } from "@/services/user.service";

// Get all carts
export const getCartItems = async () => {
    const { data: session } = await userService.getSession();
    const sessionToken = session?.session.token;
    return await cartService.getCartItems(sessionToken);
};

export const addToCart = async (medicineId: string, quantity: number) => {
    const { data: session } = await userService.getSession();
    const sessionToken = session?.session.token;
    const result = await cartService.addToCart(medicineId, quantity, sessionToken);
    updateTag("cart");
    revalidatePath("/cart");
    revalidatePath("/shop");
    return result;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
    const result = await cartService.updateCartItem(itemId, quantity);
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const removeCartItem = async (itemId: string) => {
    const result = await cartService.removeCartItem(itemId);
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const clearCart = async () => {
    const result = await cartService.clearCart();
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const mergeCart = async (guestCartItems: any[]) => {
    const result = await cartService.mergeCart(guestCartItems);
    updateTag("cart");
    revalidatePath("/cart");
    return result;
};

export const getCartCount = async () => {
    return await cartService.getCartCount();
};

export const getSelectedCartItems = async (selectedItemIds: string[]) => {
    const { data: session } = await userService.getSession();
    const sessionToken = session?.session.token;
    return await cartService.getSelectedCartItems(sessionToken, selectedItemIds);
};