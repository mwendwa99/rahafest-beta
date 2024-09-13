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
  webSocketService.connect(token);

  webSocketService.on("connected", () => {
    dispatch(setConnectionStatus(true));
    webSocketService.fetchLiveMessages();
  });

  webSocketService.on("disconnected", () => {
    dispatch(setConnectionStatus(false));
  });

  webSocketService.on("message", (data) => {
    if (data.action === "message-list") {
      dispatch(setLiveMessages(data.messages));
    } else if (data.action === "new-message") {
      dispatch(addLiveMessage(data.message));
    }
  });

  webSocketService.on("error", (error) => {
    dispatch(setError(error.message));
  });
};

export const sendMessage = (message) => (dispatch) => {
  try {
    webSocketService.send({
      action: "send-message",
      message: message,
    });
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default chatSlice.reducer;
