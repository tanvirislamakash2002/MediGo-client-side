import { createSlice } from "@reduxjs/toolkit";
import { string } from "zod";

interface initialState {
    medicineId: string;
    quantity: number;
    sessionToken: string;
}

const initialState = {
    medicineId: "",
    quantity: 1,
    sessionToken: ""
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {}
})

export default cartSlice.reducer;