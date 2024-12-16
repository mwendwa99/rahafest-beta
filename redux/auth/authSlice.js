import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  fetchUser,
  filterUserById,
  fetchAllUsers,
  updateUser,
  verifyEmail,
} from "./authActions";
import { PURGE } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { toast } from "react-toastify";

const initialState = {
  allUsers: [],
  user: null,
  token: null,
  error: null,
  loading: false,
  userById: null,
  isAuthenticated: false,
  otpEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkUserAuthentication: (state) => {
      // Check if user and token are present in the state
      state.isAuthenticated = !!state.user && !!state.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.isAuthenticated = true; // Set authentication status
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // Reset authentication status
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.error = null;
        state.isAuthenticated = true; // Set authentication status
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // Reset authentication status
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthenticated = true; // Set authentication status
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false; // Reset authentication status
      })
      .addCase(filterUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userById = action.payload;
        state.error = null;
      })
      .addCase(filterUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(verifyEmail.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.otpEmail = action.payload;
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(PURGE, () => {
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("persist:root");
        // toast.info("You have been logged out");
        return initialState;
      });
  },
});

// Call this action when initializing or rehydrating the store
export const { clearError, checkUserAuthentication } = authSlice.actions;

export default authSlice.reducer;
