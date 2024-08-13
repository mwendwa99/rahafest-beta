import { createAsyncThunk } from "@reduxjs/toolkit";
import { ticketApi } from "../../services/api.service";

export const fetchEvents = createAsyncThunk(
  "event/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketApi.get("list-events");

      //filter respose to return only active events
      const events = response.data
        .filter((event) => event.is_active)
        .map((event) => ({
          ...event,
          expired: new Date(event.end_date) < new Date(),
        }))
        .sort((b, a) => new Date(a.end_date) - new Date(b.end_date));

      return events;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
