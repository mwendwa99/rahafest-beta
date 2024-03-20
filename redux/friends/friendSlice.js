import { createSlice } from "@reduxjs/toolkit";
import {
  getFriends,
  getFriendsRequests,
  sendFriendRequest,
} from "./friendActions";

const initialState = {
  friends: null,
  sentFriendRequest: null,
  friendError: null,
  loading: false,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFriends.pending, (state) => {
      state.loading = true;
      state.friendError = null;
    });
    builder.addCase(getFriends.fulfilled, (state, action) => {
      state.loading = false;
      state.friends = action.payload;
      state.friendError = null;
    });
    builder.addCase(getFriends.rejected, (state, action) => {
      state.loading = false;
      state.friendError = action.payload;
    });
    builder.addCase(getFriendsRequests.pending, (state) => {
      state.loading = true;
      state.friendError = null;
    });
    builder.addCase(getFriendsRequests.fulfilled, (state, action) => {
      state.loading = false;
      state.friends = action.payload;
      state.friendError = null;
    });
    builder.addCase(getFriendsRequests.rejected, (state, action) => {
      state.loading = false;
      state.friendError = action.payload;
    });
    builder.addCase(sendFriendRequest.pending, (state) => {
      state.loading = true;
      state.friendError = null;
    });
    builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.sentFriendRequest = action.payload;
      state.friendError = null;
    });
    builder.addCase(sendFriendRequest.rejected, (state, action) => {
      state.loading = false;
      state.friendError = action.payload;
    });
  },
});

export default friendsSlice.reducer;
