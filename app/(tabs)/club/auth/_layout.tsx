// auth/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Prevent gestures to reduce navigation conflicts
        gestureEnabled: false,
        // Add animation to make transitions smoother
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          // Prevent multiple taps
          freezeOnBlur: true,
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          // Prevent multiple taps
          freezeOnBlur: true,
        }}
      />
    </Stack>
  );
}
