import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterApi, LoginApi, GetUserApi } from "../../services/auth.service";

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

export const getUser = createAsyncThunk(
  "auth/getUser",
  (token, { rejectWithValue }) => {
    try {
      return GetUserApi(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  (_, { rejectWithValue }) => {
    try {
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
