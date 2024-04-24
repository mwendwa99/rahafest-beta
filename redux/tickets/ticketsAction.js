import { createAsyncThunk } from "@reduxjs/toolkit"
import { GetTickets } from "../../services/tickets.service";
export const getTickets = createAsyncThunk(
    "tickets/getTickets",
    (token, { rejectWithValue }) => {
        try {
            return GetTickets(token);          
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);