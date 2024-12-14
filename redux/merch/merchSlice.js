import { createSlice } from "@reduxjs/toolkit";
import { fetchMerch } from "./merchActions";

const initialState = {
  products: [],
  error: null,
  loading: false,
};

const merchSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
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
      });
  },
});

export default merchSlice.reducer;
