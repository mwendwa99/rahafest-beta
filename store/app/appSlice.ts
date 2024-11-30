import { createSlice } from "@reduxjs/toolkit";
import { fetchAllEvents, fetchTicketTypes } from "./appActions";

import { EventType, EventTicketType } from "@/types";

interface InitialState {
  allEvents: EventType[];
  ticketTypes: EventTicketType[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  allEvents: [],
  ticketTypes: [],
  loading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.allEvents = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAllEvents.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch all events";
      })
      .addCase(fetchTicketTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketTypes.fulfilled, (state, action) => {
        state.ticketTypes = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTicketTypes.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch all events";
      });
  },
});

export default eventSlice.reducer;
