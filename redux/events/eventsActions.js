import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetEvents } from "../../services/events.service";

export const getEvents = createAsyncThunk(
    "events/getEvents",
    (token, { rejectWithValue }) => {
        try {
            return GetEvents(token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);