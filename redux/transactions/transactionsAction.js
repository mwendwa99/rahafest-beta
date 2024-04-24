import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetTransactionsApi } from "../../services/transactions.service";

export const getTransactions = createAsyncThunk(
    "transactions/getTransactions",
    (token, { rejectWithValue }) => {
        try {
            return GetTransactionsApi(token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);