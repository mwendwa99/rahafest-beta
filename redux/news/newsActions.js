import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetNewsApi } from "../../services/news.service";

export const getNews = createAsyncThunk(
  "lineup/getNews",
  (_, { rejectWithValue }) => {
    try {
      return GetNewsApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
