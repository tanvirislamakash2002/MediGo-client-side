import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cart.slice"

export const rootReducer = combineReducers({
    cart: cartReducer
})