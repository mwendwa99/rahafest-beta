import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../services/api.service";

export const fetchLiveMessages = createAsyncThunk(
  "chat/fetchLiveMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get("messages");
      const activeMessages = response.data.filter(
        (message) => message.is_active
      );
      return activeMessages;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const sendLiveMessage = createAsyncThunk(
  "chat/sendLiveMessage",
  async (message, { rejectWithValue }) => {
    try {
      const response = await authInstance.post(`messages`, message);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const sendDirectMessage = createAsyncThunk(
  "chat/sendDirectMessage",
  async (message, { rejectWithValue }) => {
    try {
      const response = await authInstance.post(`directmessages`, message);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchDirectMessages = createAsyncThunk(
  "chat/fetchDirectMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get("directmessages");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
