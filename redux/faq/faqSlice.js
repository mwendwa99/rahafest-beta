import { createSlice } from "@reduxjs/toolkit";
import { getFaq } from "./faqActions";

const initialState = {
  faq: null,
  faqError: null,
  loading: false,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFaq.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFaq.fulfilled, (state, action) => {
      state.loading = false;
      state.faq = action.payload;
    });
    builder.addCase(getFaq.rejected, (state, action) => {
      state.loading = false;
      state.faqError = action.payload;
    });
  },
});

export default faqSlice.reducer;
