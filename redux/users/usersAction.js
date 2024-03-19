import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetUsersApi } from "../../services/user.service";

export const getAllUsers = createAsyncThunk(
    "users/getAllUsers",
    (token, { rejectWithValue }) => {
        try {
            return GetUsersApi(token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);