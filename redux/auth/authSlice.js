import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  fetchUser,
  filterUserById,
  fetchAllUsers,
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
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
      .addCase(PURGE, () => {
        AsyncStorage.removeItem("token");
        AsyncStorage.removeItem("persist:root");
        // toast.info("You have been logged out");
        return initialState;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
