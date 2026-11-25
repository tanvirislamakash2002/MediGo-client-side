import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cart.slice";
import wishlistReducer from "./features/wishlist/wishlist.slice";

export const rootReducer = combineReducers({
    cart: cartReducer,
    wishlist: wishlistReducer,
});
