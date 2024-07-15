import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../services/api.service";

export const fetchLiveMessages = createAsyncThunk(
  "chat/fetchLiveMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get(`messages`);
      return response.data;
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
