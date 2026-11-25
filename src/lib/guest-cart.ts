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

export const guestCartStore = {
    getCart: (): GuestCartItem[] => {
        if (typeof window === "undefined") return [];
        const cart = localStorage.getItem(GUEST_CART_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    addItem: (item: GuestCartItem): GuestCartItem[] => {
        const cart = guestCartStore.getCart();
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

    updateQuantity: (medicineId: string, quantity: number): GuestCartItem[] => {
        if (quantity <= 0) {
            return guestCartStore.removeItem(medicineId);
        }

        const cart = guestCartStore.getCart();
        const newCart = cart.map(i =>
            i.medicineId === medicineId ? { ...i, quantity } : i
        );
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
    },

    removeItem: (medicineId: string): GuestCartItem[] => {
        const cart = guestCartStore.getCart();
        const newCart = cart.filter(i => i.medicineId !== medicineId);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
    },

    getCartCount: (): number => {
        const cart = guestCartStore.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    clearCart: () => {
        localStorage.removeItem(GUEST_CART_KEY);
    }
};