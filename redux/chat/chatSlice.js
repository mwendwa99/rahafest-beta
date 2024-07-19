import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLiveMessages,
  sendLiveMessage,
  sendDirectMessage,
  fetchDirectMessages,
} from "./chatActions";

const initialState = {
  friendRequests: [],
  chatState: {
    chatId: null,
    friendId: null,
    isChatOpen: false,
  },
  messageState: {
    messages: [],
    chatId: null,
    userId: null,
    receiverId: null,
  },
  liveMessages: [],
  directMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveMessages.fulfilled, (state, action) => {
        state.liveMessages = action.payload;
        state.loading = false;
      })
      .addCase(fetchLiveMessages.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch live messages";
      })
      .addCase(sendLiveMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendLiveMessage.fulfilled, (state, action) => {
        state.liveMessages = [...state.liveMessages, action.payload];
        state.loading = false;
      })
      .addCase(sendLiveMessage.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to send live message";
      })
      .addCase(sendDirectMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendDirectMessage.fulfilled, (state, action) => {
        state.directMessages = [...state.directMessages, action.payload];
        state.loading = false;
      })
      .addCase(sendDirectMessage.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to send direct message";
      })
      .addCase(fetchDirectMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDirectMessages.fulfilled, (state, action) => {
        state.directMessages = action.payload;
        state.loading = false;
      })
      .addCase(fetchDirectMessages.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch direct messages";
      });
  },
});

export const {
  addFriend,
  removeFriendRequest,
  startChat,
  closeChat,
  sendMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
