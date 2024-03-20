import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAcceptedFriends, GetFriendRequest, SendFriendRequest } from "../../services/friends.service";

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
    (token, { rejectWithValue }) => {
        try {
            return SendFriendRequest(token, userInfo);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);