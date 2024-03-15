import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetFaqApi } from "../../services/faq.service";

export const getFaq = createAsyncThunk(
  "faq/getFaq",
  (_, { rejectWithValue }) => {
    try {
      return GetFaqApi();
    } catch (error) {
      rejectWithValue(error);
    }
  }
);
