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
        updateQuantity: (
            state,
            action: PayloadAction<{ id?: string; medicineId?: string; quantity: number }>
        ) => {
            const { id, medicineId, quantity } = action.payload;
            const itemIndex = state.items.findIndex(
                (item) => (id && item.id === id) || (medicineId && item.medicineId === medicineId)
            );

            if (itemIndex !== -1) {
                if (quantity <= 0) {
                    state.items.splice(itemIndex, 1);
                } else {
                    state.items[itemIndex].quantity = quantity;
                }
            }
        },
        removeItem: (
            state,
            action: PayloadAction<string | { id?: string; medicineId?: string }>
        ) => {
            if (typeof action.payload === "string") {
                const targetId = action.payload;
                state.items = state.items.filter(
                    (item) => item.id !== targetId && item.medicineId !== targetId
                );
            } else {
                const { id, medicineId } = action.payload;
                state.items = state.items.filter(
                    (item) =>
                        !(id && item.id === id) &&
                        !(medicineId && item.medicineId === medicineId)
                );
            }
        },
        // add clearCart as needed
    },
});

export const { setCart, addToCart, updateQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;