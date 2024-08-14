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

export const fetchTicketTypes = createAsyncThunk(
  "event/fetchTicketTypes",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await ticketApi.get(
        `events/${eventId}/event-ticket-type`
      );

      // Filter active ticket types
      const activeTicketTypes = response.data.filter(
        (ticketType) => ticketType.is_active
      );

      // Sort by price from cheapest to most expensive
      activeTicketTypes.sort((a, b) => a.price - b.price);

      return activeTicketTypes;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
