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

export const fetchGallery = createAsyncThunk(
  "event/fetchGallery",
  async (_, { rejectWithValue }) => {
    try {
      const response = await rahaApi.get("gallery");

      //filter response to only render active gallery
      const filteredGallery = response.data.data.filter(
        (item) => item.active === true
      );

      return filteredGallery;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
