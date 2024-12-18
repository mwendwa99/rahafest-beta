import { createAsyncThunk } from "@reduxjs/toolkit";
import { ticketApi } from "../../services/api.service";
import { success } from "../../utils/toast";

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

export const createOrder = createAsyncThunk(
  "merch/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ticketApi.post("orders/create-order", data);
      if (!response.data) {
        throw new Error("No data received from server");
      }
      return response.data.data;
    } catch (error) {
      // Improve error handling
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create order";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const triggerSTK = createAsyncThunk(
  "merch/triggerSTK",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ticketApi.post("mpesa/checkout", data);

      if (!response.data) {
        throw new Error("No data received from the server");
      }

      console.log("MPESA RESPONSE", response.data);
      success("Payment successful!");

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create order";
      return rejectWithValue({ message: errorMessage });
    }
  }
);
