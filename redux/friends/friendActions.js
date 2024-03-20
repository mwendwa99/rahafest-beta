import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAcceptedFriends,
  GetFriendRequest,
  SendFriendRequestApi,
} from "../../services/friend.service";

export const getFriends = createAsyncThunk(
  "friends/getFriends",
  (token, { rejectWithValue }) => {
    try {
      return GetAcceptedFriends(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFriendsRequests = createAsyncThunk(
  "friends/getFriendRequest",
  (token, { rejectWithValue }) => {
    try {
      return GetFriendRequest(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  ({ token, data }, { rejectWithValue }) => {
    try {
      //   console.log("data", data);
      return SendFriendRequestApi(token, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
