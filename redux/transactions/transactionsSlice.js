import { createSlice } from "@reduxjs/toolkit";
import { getTransactions } from "./transactionsAction";

const initialState = {
    transactions: null,
    transactionsError: null,
    loading: false,
};

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
                state.transactionsError = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
                state.transactionsError = null;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.transactionsError = action.payload;
            });
    }
});

export default transactionsSlice.reducer;