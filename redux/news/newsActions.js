import { createAsyncThunk } from "@reduxjs/toolkit";
import { rahaApi } from "../../services/api.service";

export const fetchNews = createAsyncThunk(
  "event/fetchNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rahaApi.get("media");

      //filter response to only render active news
      response.data.data = response.data.data.filter(
        (article) => article.active === true
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
