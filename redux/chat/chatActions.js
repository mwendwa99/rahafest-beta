import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllMessages, PostMessage } from "../../services/chat.service";

export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  (token, { rejectWithValue }) => {
    try {
      return GetAllMessages(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const postMessage = createAsyncThunk(
  "chat/postMessage",
  (token, { rejectWithValue }) => {
    try {
      return PostMessage(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)
