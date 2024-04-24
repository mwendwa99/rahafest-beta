import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetWalletApi } from "../../services/wallet.service";
export const getWallet = createAsyncThunk(
    "wallet/getWallet",
    (token, { rejectedWithValue}) => {
        try {
            return GetWalletApi(token);
;        } catch (error) {
            return rejectedWithValue(error.message);
        }
    }
)