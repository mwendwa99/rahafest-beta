import api from "../../services/club.api.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { danger, success } from "../../utils/toast";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await api.post("register", user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", user);
      success(response.data.message);
      await AsyncStorage.setItem("token", response.data.data.token);
      return response.data.data;
    } catch (error) {
      if (error.response.data?.message) {
        danger(error.response.data.message);
        return rejectWithValue(
          error.response.data?.message || "Login failed. Please try again."
        );
      } else {
        return rejectWithValue(
          error.response.data?.message || "Login failed. Please try again."
        );
      }
    }
  }
);

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (user, { rejectWithValue }) => {
//     try {
//       const response = await api.post("login", user);
//       await AsyncStorage.setItem("token", response.data.data.token);
//       return response.data.data;
//     } catch (error) {
//       console.log(error);
//       // alert("Invalid email or password");
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("user");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.patch("user", data);
      return response.data.data;
    } catch (error) {
      danger("server error", 2000);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("all-users");
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

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.delete("delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("forgot-password", email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("verify-otp", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createNewPassword = createAsyncThunk(
  "auth/createNewPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("reset-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
