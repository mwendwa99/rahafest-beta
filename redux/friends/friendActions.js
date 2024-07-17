import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../services/api.service";

export const fetchPendingFriendRequests = createAsyncThunk(
  "friends/fetchPendingFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get("unaccepted-friendship-requests");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authInstance.post(`request-friendship`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get("accepted-friendships");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
