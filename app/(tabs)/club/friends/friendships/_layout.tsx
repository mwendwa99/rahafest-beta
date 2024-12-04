import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import IconButton from "@/components/IconButton";

export default function FriendsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
