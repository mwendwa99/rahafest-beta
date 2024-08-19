import { createSlice } from "@reduxjs/toolkit";
import { fetchEvents, fetchTicketTypes, createInvoice } from "./eventActions";

const initialState = {
  events: [],
  ticketTypes: [],
  invoice: null,
  loading: false,
  error: null,
  invoiceError: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearEventsError: (state) => {
      state.error = null;
    },
    clearInvoiceError: (state) => {
      state.invoiceError = null;
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
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.invoiceError = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.invoiceError = action.payload;
      });
  },
});

export const { clearEventsError, clearInvoiceError } = eventSlice.actions;

export default eventSlice.reducer;
