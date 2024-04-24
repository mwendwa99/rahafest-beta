import { createSlice } from "@reduxjs/toolkit";
import { getEvents } from "./eventsActions";

const initialState = {
    events: null,
    eventsError: null,
    loading: false,
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEvents.pending, (state) => {
                state.loading = true;
                state.eventsError = null;
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
                state.eventsError = null;
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.loading = false;
                state.eventsError = action.payload;
            });
    }
});

export default eventsSlice.reducer;