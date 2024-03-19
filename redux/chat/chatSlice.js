import { createSlice } from "@reduxjs/toolkit";
import {
  getAllChats,
  postMessage,
  getDirectMessages,
  acceptFriendRequest,
  rejectFriendRequest,
} from "./chatActions";

const initialState = {
  allChats: [],
  chatError: null,
  loading: false,
  directMessages: null,
  sentMessage: null,
  friendsError: false,
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
        state.loading = true;
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sentMessage = action.payload;
        state.chatError = null;
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      })
      .addCase(getDirectMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDirectMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.directMessages = action.payload;
        state.chatError = null;
      })
      .addCase(getDirectMessages.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.chatError = null;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      })
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.chatError = null;
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      });
  },
});

export default chatSlice.reducer;
