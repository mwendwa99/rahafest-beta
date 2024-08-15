import { createSlice } from "@reduxjs/toolkit";
import { fetchEvents, fetchTicketTypes } from "./eventActions";

const initialState = {
  events: [],
  ticketTypes: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearEventsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTicketTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.ticketTypes = action.payload;
      })
      .addCase(fetchTicketTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEventsError } = eventSlice.actions;

export default eventSlice.reducer;
