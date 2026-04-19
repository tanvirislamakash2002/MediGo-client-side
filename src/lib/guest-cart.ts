"use client";

interface GuestCartItem {
    medicineId: string;
    quantity: number;
    name: string;
    price: number;
    manufacturer: string;
    imageUrl: string | null;
    requiresPrescription: boolean;
    stock: number;
    id?: string;
}

const GUEST_CART_KEY = "medigo_guest_cart";

export const cartStore = {
    getCart: (): GuestCartItem[] => {
        if (typeof window === "undefined") return [];
        const cart = localStorage.getItem(GUEST_CART_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    addItem: (item: GuestCartItem): GuestCartItem[] => {
        const cart = cartStore.getCart();
        const existingItem = cart.find(i => i.medicineId === item.medicineId);
        
        let newCart: GuestCartItem[];
        if (existingItem) {
            newCart = cart.map(i =>
                i.medicineId === item.medicineId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
            );
        } else {
            newCart = [...cart, { ...item, id: crypto.randomUUID() }];
        }
        
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
    },

    // ✅ Add this method
    updateQuantity: (medicineId: string, quantity: number): GuestCartItem[] => {
        if (quantity <= 0) {
            return cartStore.removeItem(medicineId);
        }
        
        const cart = cartStore.getCart();
        const newCart = cart.map(i =>
            i.medicineId === medicineId ? { ...i, quantity } : i
        );
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
    },

    // ✅ Add this method
    removeItem: (medicineId: string): GuestCartItem[] => {
        const cart = cartStore.getCart();
        const newCart = cart.filter(i => i.medicineId !== medicineId);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
    },

    getCartCount: (): number => {
        const cart = cartStore.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    clearCart: () => {
        localStorage.removeItem(GUEST_CART_KEY);
    }
};