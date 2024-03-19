import { createSlice } from "@reduxjs/toolkit";
import { getFriends, getFriendsRequests, sendFriendRequest } from "./friendsActions";

const initialState = {
    friends: [],
    friendRequests: [],
    friendError: null,
    friendReqError: null,
    loading: false,
};

const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFriends.pending, (state) => {
            state.loading = true;
            state.friendsError = null;
        });
        builder.addCase(getFriends.fulfilled, (state, action) => {
            state.loading = false;
            state.friends = action.payload;
            state.friendsError = null;
        });
        builder.addCase(getFriends.rejected, (state, action) => {
            state.loading = false;
            state.friendsError = action.payload;
        });
        builder.addCase(getFriendsRequests.pending, (state) => {
            state.loading = true;
            state.friendsError = null;
        });
        builder.addCase(getFriendsRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.friends = action.payload;
            state.friendsError = null;
        });
        builder.addCase(getFriendsRequests.rejected, (state, action) => {
            state.loading = false;
            state.friendsError = action.payload;
        });
        builder.addCase(sendFriendRequest.pending, (state) => {
            state.loading = true;
            state.friendReqError = null;
        });
        builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.friendRequests = action.payload;
            state.friendReqError = null;
        });
        builder.addCase(sendFriendRequest.rejected, (state, action) => {
            state.loading = false;
            state.friendReqError = action.payload;
        });
    }
});

export default friendsSlice.reducer;
