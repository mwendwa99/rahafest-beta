//@ts-nocheck
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
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="form/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
