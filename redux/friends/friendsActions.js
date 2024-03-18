import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAcceptedFriends } from "../../services/friends.service";

export const getFriends = createAsyncThunk(
    "friends",
    (token, { rejectWithValue }) => {
        try {
            return GetAcceptedFriends(token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)