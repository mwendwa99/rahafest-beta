import { createSlice } from "@reduxjs/toolkit";
import { fetchNews, fetchGallery } from "./newsActions";

const initialState = {
  news: null,
  gallery: null,
  error: null,
  loading: false,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data;
        state.error = null;
      })

      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload;
        state.error = null;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default newsSlice.reducer;
