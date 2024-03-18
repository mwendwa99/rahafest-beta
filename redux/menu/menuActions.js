import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetMenu } from "../../services/menu.service";

export const getMenu = createAsyncThunk(
    "menu/getMenu",
    (_, { rejectWithValue}) => {
        try {
            return GetMenu();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)