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
        // add removeItem, clearCart as needed
    },
});

export const { setCart, addToCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;