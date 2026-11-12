import { createSlice } from "@reduxjs/toolkit";
import { IInitialCartState } from "./cart.type";


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
        addToCart: (state, action) => {
            state.items.push(action.payload)
        }
    }
})

export const { addToCart } = cartSlice.actions

export default cartSlice.reducer;