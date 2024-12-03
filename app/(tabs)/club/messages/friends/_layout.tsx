import React from "react";
import { Stack } from "expo-router";

export default function FriendsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Add Friends",
          headerStyle: {
            backgroundColor: "#000", // Transparent background
          },
          headerTitleStyle: {
            color: "#fff", // White font color
          },
          headerTintColor: "#fff", // Adjust back button color (if present)
        }}
      />
    </Stack>
  );
}
