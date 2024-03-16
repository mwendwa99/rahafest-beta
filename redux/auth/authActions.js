import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterApi, LoginApi } from "../../services/auth.service";

export const register = createAsyncThunk(
  "auth/register",
  (userData, { rejectWithValue }) => {
    try {
      return RegisterApi(userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  (userData, { rejectWithValue }) => {
    try {
      return LoginApi(userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
