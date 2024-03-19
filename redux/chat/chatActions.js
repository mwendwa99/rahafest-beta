import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllMessages,
  PostMessageApi,
  GetDirectMessages,
  AcceptFriendRequest,
  RejectFriendRequest,
  GetUsersApi,
  SendFriendRequestApi,
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
  ({ token, message }, { rejectWithValue }) => {
    try {
      return PostMessageApi(token, message);
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

export const acceptFriendRequest = createAsyncThunk(
  "chat/acceptFriendRequest",
  ({ token, data }, { rejectWithValue }) => {
    try {
      return AcceptFriendRequest(token, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "chat/rejectFriendRequest",
  ({ token, data }, { rejectWithValue }) => {
    try {
      return RejectFriendRequest(token, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUsers = createAsyncThunk(
  "chat/getUsers",
  (token, { rejectWithValue }) => {
    try {
      return GetUsersApi(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "chat/sendFriendRequest",
  ({ token, data }, { rejectWithValue }) => {
    try {
      return SendFriendRequestApi(token, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
