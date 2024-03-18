import { createSlice } from "@reduxjs/toolkit";
import { getAllChats, postMessage } from "./chatActions";

const initialState = {
  allChats: [],
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
      })

      .addCase(postMessage.pending, (state) => {
        state.loading;
      })

      .addCase(postMessage.fulfilled, (state, action) => {
        state.loading = false;
        // state.allChats = ac
        state.chatError = null;
      })

      .addCase(postMessage.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.payload
      })
  },
});

export default chatSlice.reducer;
