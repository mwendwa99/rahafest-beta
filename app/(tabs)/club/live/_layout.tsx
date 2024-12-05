import React from "react";

import { Stack } from "expo-router";
import Typography from "@/components/Typography";

export default function LiveLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: (props) => <Typography variant="h6">Live</Typography>,
          headerStyle: {
            backgroundColor: "#000", // Transparent background
          },
          headerTitleStyle: {
            color: "#fff", // White font color
          },
          headerTintColor: "#fff", // Adjust back button color (if present)
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
