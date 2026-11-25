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
        addToWishlistOptimistic: (
            state,
            action: PayloadAction<{ medicineId: string; item?: IWishlistItem }>
        ) => {
            const { medicineId, item } = action.payload;
            if (!state.itemIds.includes(medicineId)) {
                state.itemIds.push(medicineId);
                if (item) {
                    state.items.push(item);
                } else {
                    state.items.push({
                        id: `temp-${medicineId}`,
                        medicineId,
                        addedAt: new Date().toISOString(),
                    });
                }
            }
        },
    },
});

export const {
    setWishlist,
    addToWishlistOptimistic
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
