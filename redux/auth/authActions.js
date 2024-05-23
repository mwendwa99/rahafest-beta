import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  RegisterApi,
  LoginApi,
  GetUserApi,
  DeleteAccountApi,
} from "../../services/auth.service";
import { chatApi } from "../../services/api.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  async (userData, { rejectWithValue }) => {
    try {
      // return LoginApi(userData);
      const response = await chatApi.post("/login", userData);

      // save token to async storage
      await AsyncStorage.setItem("token", response.data.token.access);

      return response.data;
    } catch (error) {
      // Default error message
      let errorMessage = "An error occurred";

      // Check if response data has an errors object
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        // Iterate through the keys of the errors object
        for (let key in errors) {
          if (
            errors[key] &&
            Array.isArray(errors[key]) &&
            errors[key].length > 0
          ) {
            // Extract the first error message
            errorMessage = errors[key][0];
            break;
          }
        }
      }

      return rejectWithValue(errorMessage);
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

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  (token, { rejectWithValue }) => {
    try {
      return DeleteAccountApi(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
