import { createSlice } from "@reduxjs/toolkit"
import { getTickets } from "./ticketsAction";
const initialState ={
    tickets: null,
    ticketsError: null,
    loading: false,
};

const ticketsSlice = createSlice({
    name: "tickets",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTickets.pending, (state) => {
                state.loading = true;
                state.ticketsError = null;
            })
            .addCase(getTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
                state.ticketsError = null;
            })
            .addCase(getTickets.rejected, (state, action) => {
                state.loading = false,
                state.ticketsError = action.error;
            })
    }
});

export default ticketsSlice.reducer;