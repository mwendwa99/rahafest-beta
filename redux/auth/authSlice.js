import { createSlice } from "@reduxjs/toolkit";
import { register, login, getUser, logout } from "./authActions";
import { PURGE } from "redux-persist";

const initialState = {
  user: null,
  authError: null,
  loading: false,
  token: null,
  roles: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.authError = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.authError = action.error;
    });
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token.access;
      state.roles = action.payload.roles;
      state.authError = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.authError = action.error;
    });
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.authError = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.authError = action.error;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.roles = null;
      state.authError = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.authError = action.error;
    });
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export default authSlice.reducer;
