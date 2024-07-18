import { createAsyncThunk } from "@reduxjs/toolkit";
import { authInstance } from "../../services/api.service";
import { fetchAllUsers } from "../auth/authActions";

// export const fetchPendingFriendRequests = createAsyncThunk(
//   "friends/fetchPendingFriendRequests",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authInstance.get("unaccepted-friendship-requests");
//       return response.data;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

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

      // Enhance pending friend requests with user details
      const enhancedRequests = pendingFriendRequests.map((request) => {
        const userDetail = allUsers.find((user) => user.id === request.friend);
        return {
          ...request,
          friendDetails: userDetail,
        };
      });

      return enhancedRequests;
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
