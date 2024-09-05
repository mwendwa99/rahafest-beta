import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../services/api.service";
import { fetchAllUsers } from "../auth/authActions";

export const fetchPendingFriendRequests = createAsyncThunk(
  "friends/fetchPendingFriendRequests",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      // Fetch pending friend requests
      const response = await authInstance.get("unaccepted-friendship-requests");
      const pendingFriendRequests = response.data;

      // Ensure all users are fetched
      await dispatch(fetchAllUsers());
      const allUsers = getState().auth.allUsers; // Adjust according to your store structure

      // console.log("Fetched all users:", allUsers);

      if (!allUsers) {
        throw new Error("No users available in state.");
      }

      // Enhance pending friend requests with user details
      const enhancedRequests = pendingFriendRequests.map((request) => {
        const userDetail = allUsers.find((user) => user.id === request.friend);
        return {
          ...request,
          friendDetails: userDetail || {}, // Ensure friendDetails is always an object
        };
      });

      // console.log("Enhanced requests:", enhancedRequests);

      return enhancedRequests;
    } catch (err) {
      console.error("Failed to fetch pending friend requests:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await authInstance.get("accepted-friendships");
      const friends = response.data;

      // Ensure all users are fetched
      await dispatch(fetchAllUsers());
      const allUsers = getState().auth.allUsers;
      const currentUser = getState().auth.user;

      // Enhance friends with user details and filter out the current user
      const enhancedFriends = friends
        .filter((friend) => friend.friend !== currentUser.id) // Filter out the current user
        .map((friend) => {
          const userDetail = allUsers.find((user) => user.id === friend.friend);
          return {
            ...friend,
            friendDetails: userDetail,
          };
        });

      return enhancedFriends;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await authInstance.patch(`friendships/accept`, id);
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

export const fetchNonFriends = createAsyncThunk(
  "friends/fetchNonFriends",
  async (currentUser, { rejectWithValue, dispatch, getState }) => {
    try {
      await dispatch(fetchAllUsers());
      const allUsers = getState().auth.allUsers;

      // Filter out users who are friends
      const nonFriends = allUsers.filter((user) => {
        // Exclude the current user from the list
        if (user.id === currentUser.id) return false;

        // Check if the current user is in the user's friendships list
        const isFriend = user.friendships.some(
          (friendship) => friendship.friend === currentUser.id
        );

        // Only return users who are not friends
        return !isFriend;
      });

      return nonFriends;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
