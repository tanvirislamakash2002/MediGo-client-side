import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem, IInitialCartState } from "./cart.type";

const initialState: IInitialCartState = {
    items: [],
    couponCode: null,
    lastValidatedAt: null,
    isSyncing: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<ICartItem[]>) => {
            state.items = action.payload;
        },
        addToCart: (state, action: PayloadAction<ICartItem>) => {
            const existingItem = state.items.find(
                (item) => item.medicineId === action.payload.medicineId
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        // add updateQuantity, removeItem, clearCart as needed
    },
});

export const { setCart, addToCart } = cartSlice.actions;
export default cartSlice.reducer;