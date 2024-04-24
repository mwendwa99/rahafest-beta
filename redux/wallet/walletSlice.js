import { createSlice } from "@reduxjs/toolkit";
import { getWallet } from "./walletActions";

const initialState = {
    wallet: null,
    walletError: null,
    loading: false,
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {},
    extraReducers: (builder)=> {
        builder
            .addCase(getWallet.pending, (state) => {
                state.loading = true;
                state.walletError = null;
            })
            .addCase(getWallet.fulfilled, (state, action) => {
                state.loading = false;
                state.wallet = action.payload;
                state.walletError = null;
            })
            .addCase(getWallet.rejected, (state, action) => {
                state.loading = false;
                state.walletError = action.payload;
            })
    }
});

export default walletSlice.reducer;