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

const CART_STORAGE_KEY = "medigo_cart";

export const cartStore = {
    // Get cart from localStorage
    getCart: (): GuestCartItem[] => {
        if (typeof window === "undefined") return [];
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },
    
    // Add item to cart
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
        
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
    },
    
    // Get cart count
    getCartCount: (): number => {
        const cart = cartStore.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    // Clear cart
    clearCart: () => {
        localStorage.removeItem(CART_STORAGE_KEY);
    }
};