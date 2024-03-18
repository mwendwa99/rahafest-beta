import { createSlice } from "@reduxjs/toolkit";
import { getLineup } from "./lineupActions";

const initialState = {
  lineup: null,
  lineupError: null,
  loading: false,
};

const lineupSlice = createSlice({
  name: "lineup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLineup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLineup.fulfilled, (state, action) => {
        state.loading = false;
        state.lineup = action.payload.data;
        state.lineupError = null;
      })

      .addCase(getLineup.rejected, (state, action) => {
        state.loading = false;
        state.lineupError = action.error;
      });
  },
});

export default lineupSlice.reducer;
