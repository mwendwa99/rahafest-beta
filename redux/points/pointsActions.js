import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetPointApi } from "../../services/points.service";

export const getPoints = createAsyncThunk(
    "points/getPoints",
    (token, { rejectWithValue }) => {
        try {
            return GetPointApi(token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)