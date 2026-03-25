"use client";

import { useCart } from "@/hooks/useCart";
import { createContext, useContext } from "react";

const CartContext = createContext<ReturnType<typeof useCart> | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const cart = useCart();
    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCartContext must be used within CartProvider");
    return context;
};