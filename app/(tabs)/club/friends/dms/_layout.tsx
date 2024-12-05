import React from "react";

import { Stack, useLocalSearchParams } from "expo-router";
import Typography from "@/components/Typography";

export default function DMLayout() {
  const { friendSlug } = useLocalSearchParams();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: (props) => (
            <Typography variant="body1">{friendSlug}</Typography>
          ),
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
