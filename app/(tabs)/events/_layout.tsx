import { fetchAllEvents } from "@/store/app/appActions";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EventLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
