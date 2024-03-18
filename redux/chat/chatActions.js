import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllMessages,
  PostMessageApi,
  GetDirectMessages,
} from "../../services/chat.service";

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
  (message, { rejectWithValue }) => {
    try {
      return PostMessageApi(message);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getDirectMessages = createAsyncThunk(
  "chat/getDirectMessages",
  ({ token, messageId }, { rejectWithValue }) => {
    try {
      return GetDirectMessages(token, messageId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
