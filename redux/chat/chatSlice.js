import { createSlice } from "@reduxjs/toolkit";
import { fetchLiveMessages, sendLiveMessage } from "./chatActions";

const initialState = {
  friendRequests: [
    { id: 1, name: "Mulunjez", avatar: "/images/avatar.jpg", status: "online" },
    {
      id: 2,
      name: "Kaplemino",
      avatar: "/images/avatar.jpg",
      status: "offline",
    },
    { id: 3, name: "Oraimo", avatar: "/images/avatar.jpg", status: "online" },
  ],
  friendsList: [
    {
      id: 1,
      name: "Luciel",
      avatar: "/images/avatar.jpg",
      status: "online",
    },
    {
      id: 2,
      name: "Franko",
      avatar: "/images/avatar.jpg",
      status: "offline",
    },
    {
      id: 3,
      name: "Supra",
      avatar: "/images/avatar.jpg",
      status: "online",
    },
    {
      id: 4,
      name: "Muerthjia",
      avatar: "/images/avatar.jpg",
      status: "offline",
    },
    {
      id: 5,
      name: "Githinji",
      avatar: "/images/avatar.jpg",
      status: "online",
    },
  ],
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
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addFriend: (state, action) => {
      console.log("Accepted friend with id:", action.payload.id);
      state.friendRequests = state.friendRequests.filter(
        (request) => request.id !== action.payload.id
      );
      state.friendsList = [...state.friendsList, action.payload]; // Add to friends list
    },
    removeFriendRequest: (state, action) => {
      console.log("Rejected friend with id:", action.payload.id);
      state.friendRequests = state.friendRequests.filter(
        (request) => request.id !== action.payload.id
      );
    },
    startChat: (state, action) => {
      console.log(
        "Started chat with chatId:",
        action.payload.chatId,
        "and friendId:",
        action.payload.friendId
      );
      state.chatState = {
        chatId: action.payload.chatId,
        friendId: action.payload.friendId,
        isChatOpen: true,
      };
    },
    closeChat: (state) => {
      state.chatState = {
        chatId: null,
        friendId: null,
        isChatOpen: false,
      };
    },
    sendMessage: (state, action) => {
      state.messageState = {
        messages: [...state.messageState.messages, action.payload],
        chatId: action.payload.chatId,
        userId: action.payload.userId,
        receiverId: action.payload.receiverId,
      };
    },
  },
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
