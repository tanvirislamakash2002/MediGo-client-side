import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialWishlistState, IWishlistItem } from "./wishlist.type";

const initialState: IInitialWishlistState = {
    items: [],
    itemIds: [],
    isInitialized: false,
    isLoading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<IWishlistItem[]>) => {
            state.items = action.payload;
            state.itemIds = action.payload.map((item) => item.medicineId);
            state.isInitialized = true;
            state.isLoading = false;
            state.error = null;
        },

    },
});

export const {
    setWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
