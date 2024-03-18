import { createSlice } from "@reduxjs/toolkit";
import { getNews } from "./newsActions";

const initialState = {
  news: null,
  newsError: null,
  loading: false,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data;
        state.newsError = null;
      })

      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.newsError = action.error;
      });
  },
});

export default newsSlice.reducer;
