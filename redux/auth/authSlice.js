import { createSlice } from "@reduxjs/toolkit";
import { register, login } from "./authActions";

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
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.authError = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.authError = action.error;
    });
  },
});

export default authSlice.reducer;
