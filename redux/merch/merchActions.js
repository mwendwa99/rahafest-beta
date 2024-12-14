import { createAsyncThunk } from "@reduxjs/toolkit";
import { ticketApi } from "../../services/api.service";
export const fetchMerch = createAsyncThunk(
  "merch/fetchMerch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketApi.get("all-products");

      // Extract and filter the items array to include only active products
      const activeItems = response.data.data.items.filter(
        (product) => product.is_active === true
      );

      return activeItems; // Return only the filtered items array
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
