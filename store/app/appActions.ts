import { ticketApi } from "@/services/api.service";
import { EventTicketType, EventType } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const fetchAllEvents = createAsyncThunk<
  EventType[],
  void,
  { rejectValue: string }
>("event/fetchAllEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await ticketApi.get("list-events");
    const events: EventType[] = response.data;

    // Filter response to return only active events
    const filteredEvents = events
      .filter((event: EventType) => event.is_active)
      .map((event: EventType) => ({
        ...event,
        expired: new Date(event.end_date) < new Date(),
      }))
      .sort(
        (a: EventType, b: EventType) =>
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
      );

    return filteredEvents;
  } catch (error) {
    // Handle the error with appropriate type casting
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

export const fetchTicketTypes = createAsyncThunk<
  EventTicketType[],
  number,
  { rejectValue: string }
>("event/fetchEventTicketTypes", async (id, { rejectWithValue }) => {
  try {
    const response = await ticketApi.get<EventTicketType[]>(
      `events/${id}/event-ticket-type`
    );

    // Filter active ticket types
    const activeTicketTypes = response.data.filter(
      (ticketType) => ticketType.is_active
    );

    // Sort by price from cheapest to most expensive
    activeTicketTypes.sort((a, b) => Number(a.price) - Number(b.price)); // Convert price to number

    return activeTicketTypes;
  } catch (error) {
    const axiosError = error as AxiosError;
    return rejectWithValue(axiosError.response?.data as string);
  }
});

export const createInvoice = createAsyncThunk(
  "event/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await ticketApi.post("create-invoice", invoiceData);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data as string);
    }
  }
);

export const triggerSTK = createAsyncThunk(
  "app/triggerSTK",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ticketApi.post("initiate-payment", data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data as string);
    }
  }
);
