import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFriends,
  fetchPendingFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
} from "./friendActions";

const initialState = {
  friends: null,
  pendingRequests: null,
  sentFriendRequest: null,
  acceptedRequest: null,
  error: null,
  loading: false,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFriends.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      state.loading = false;
      state.friends = action.payload;
      state.error = null;
    });
    builder.addCase(fetchFriends.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchPendingFriendRequests.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPendingFriendRequests.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingRequests = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPendingFriendRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(sendFriendRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.sentFriendRequest = action.payload;
      state.error = null;
    });
    builder.addCase(sendFriendRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(acceptFriendRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.acceptedRequest = action.payload;
      state.error = null;
    });
    builder.addCase(acceptFriendRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default friendsSlice.reducer;
