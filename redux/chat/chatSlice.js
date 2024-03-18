import { createSlice } from "@reduxjs/toolkit";
import { getAllChats } from "./chatActions";

const initialState = {
  allChats: null,
  chatError: null,
  loading: false,
};

const chatSlice = createSlice({
  name: "allChats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.allChats = action.payload;
        state.chatError = null;
      })

      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      });
  },
});

export default chatSlice.reducer;
