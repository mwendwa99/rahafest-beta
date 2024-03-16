import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetLineupApi } from "../../services/lineup.service";

export const getLineup = createAsyncThunk(
  "lineup/getLineup",
  (_, { rejectWithValue }) => {
    try {
      return GetLineupApi();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
