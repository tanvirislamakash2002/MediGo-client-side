import { createSlice } from "@reduxjs/toolkit";

interface InitialCartState {
    items: CartItem[];
    couponCode: string | null;
    lastValidatedAt: string | null;
    isSyncing: boolean;
    error: string | null;
}

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

const initialState: InitialCartState = {
    items: [],
    couponCode: null,
    lastValidatedAt: null,
    isSyncing: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {}
})

export default cartSlice.reducer;