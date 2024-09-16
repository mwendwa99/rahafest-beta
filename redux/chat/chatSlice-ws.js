import { createSlice } from "@reduxjs/toolkit";
import { webSocketService } from "../../services/ws.service";

const chatSlice = createSlice({
  name: "live",
  initialState: {
    liveMessages: [],
    isConnected: false,
    error: null,
  },
  reducers: {
    setLiveMessages: (state, action) => {
      state.liveMessages = action.payload;
    },
    addLiveMessage: (state, action) => {
      state.liveMessages.push(action.payload);
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLiveMessages,
  addLiveMessage,
  setConnectionStatus,
  setError,
} = chatSlice.actions;

export const initializeWebSocket = (token) => (dispatch) => {
  const messageListWS = webSocketService.createConnection(
    "message-list",
    "ws://rahaclub.rahafest.com/ws/messages/"
  );

  messageListWS.connect(token);

  messageListWS.on("connected", () => {
    dispatch(setConnectionStatus(true));
    // Note: fetchLiveMessages is removed as it's not part of the new WebSocket implementation
  });

  messageListWS.on("disconnected", () => {
    dispatch(setConnectionStatus(false));
  });

  messageListWS.on("message", (data) => {
    if (data.action === "message-list") {
      dispatch(setLiveMessages(data.messages));
    } else if (data.action === "new-message") {
      dispatch(addLiveMessage(data.message));
    }
  });

  messageListWS.on("error", (error) => {
    dispatch(setError(error.message));
  });
};

export const sendMessage = (message) => (dispatch) => {
  try {
    const messageListWS = webSocketService.getConnection("message-list");
    messageListWS.send({
      action: "send-message",
      message: message,
    });
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default chatSlice.reducer;
