import { createSlice } from "@reduxjs/toolkit";
import { fetchAllEvents } from "./appActions";

import { EventType } from "@/types";

interface InitialState {
  allEvents: EventType[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  allEvents: [],
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
      });
  },
});

export default eventSlice.reducer;
