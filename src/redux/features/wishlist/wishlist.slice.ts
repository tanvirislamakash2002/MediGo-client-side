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
        removeFromWishlistOptimistic: (state, action: PayloadAction<string>) => {
            const medicineId = action.payload;
            state.itemIds = state.itemIds.filter((id) => id !== medicineId);
            state.items = state.items.filter(
                (item) => item.medicineId !== medicineId && item.id !== medicineId
            );
        },
        clearWishlist: (state) => {
            state.items = [];
            state.itemIds = [];
            state.isInitialized = true;
            state.error = null;
        },
        setWishlistLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setWishlistInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
});

export const {
    setWishlist,
    addToWishlistOptimistic,
    removeFromWishlistOptimistic,
    clearWishlist,
    setWishlistLoading,
    setWishlistInitialized,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
