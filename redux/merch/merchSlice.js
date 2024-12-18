import { createSlice } from "@reduxjs/toolkit";
import { fetchMerch, createOrder, triggerSTK } from "./merchActions";

const initialState = {
  products: [],
  error: null,
  loading: false,
  order: null,
  mpesa_response: null,
};

const merchSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.order = null; // Clear stale data
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerch.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMerch.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })

      .addCase(fetchMerch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(triggerSTK.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(triggerSTK.fulfilled, (state, action) => {
        state.mpesa_response = action.payload;
        state.loading = false;
      })
      .addCase(triggerSTK.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearOrderState } = merchSlice.actions;

export default merchSlice.reducer;
