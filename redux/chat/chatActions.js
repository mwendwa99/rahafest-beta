import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllMessages } from "../../services/chat.service";

export const getAllChats = createAsyncThunk(
  "lineup/getLineup",
  (token, { rejectWithValue }) => {
    try {
      return GetAllMessages(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
