import { authInstance } from "../../services/api.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await authInstance.post("register", user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await authInstance.post("login", user);
      // console.log(response.data.data);
      // save token to local storage
      // localStorage.setItem("token", response.data.data.token);
      await AsyncStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get("user");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get("all-users");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const filterUserById = createAsyncThunk(
  "chat/filterUserById",
  async (id, { rejectWithValue }) => {
    try {
      // fetchAllUsers then filter by id
      const allUsers = fetchAllUsers();
      const user = allUsers.find((user) => user.id === id);
      return user;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
