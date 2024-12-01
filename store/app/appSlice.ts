import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllEvents,
  fetchTicketTypes,
  createInvoice,
  triggerSTK,
} from "./appActions";

import { EventType, EventTicketType, InvoiceResponseType } from "@/types";

interface InitialState {
  allEvents: EventType[];
  ticketTypes: EventTicketType[];
  invoice: InvoiceResponseType;
  loading: boolean;
  error: string | null;
  payment_status: string;
}

const initialState: InitialState = {
  allEvents: [],
  ticketTypes: [],
  invoice: null,
  loading: false,
  error: null,
  payment_status: "UNPAID",
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
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoice = action.payload;
        state.loading = false;
      })
      .addCase(createInvoice.rejected, (state) => {
        state.error = "Failed to create invoice";
        state.loading = false;
      })
      .addCase(triggerSTK.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(triggerSTK.fulfilled, (state, action) => {
        state.payment_status = action.payload.payment_status;
        state.loading = false;
      })
      .addCase(triggerSTK.rejected, (state) => {
        state.error = "Failed to initiate payment";
        state.loading = false;
      });
  },
});

export default eventSlice.reducer;
