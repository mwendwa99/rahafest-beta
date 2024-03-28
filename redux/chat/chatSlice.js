import { createSlice } from "@reduxjs/toolkit";
import {
  getAllChats,
  postMessage,
  getDirectMessages,
  acceptFriendRequest,
  rejectFriendRequest,
  getUsers,
  getDirectMessage,
  sendDirectMessage,
} from "./chatActions";

const initialState = {
  allChats: [],
  chatError: null,
  loading: false,
  directMessages: null,
  sentPost: null,
  sentDirectMessage: null,
  users: null,
  directMessage: null,
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
        state.sentPost = action.payload;
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
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.chatError = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      })
      .addCase(getDirectMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDirectMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.directMessage = action.payload;
        state.chatError = null;
      })
      .addCase(getDirectMessage.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      })
      .addCase(sendDirectMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendDirectMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sentDirectMessage = action.payload;
        state.chatError = null;
      })
      .addCase(sendDirectMessage.rejected, (state, action) => {
        state.loading = false;
        state.chatError = action.error;
      });
  },
});

export default chatSlice.reducer;
