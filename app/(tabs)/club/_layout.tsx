// club/_layout.tsx
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/auth";

export default function ClubLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  // const isAuthenticated = false;
  // const isLoading = false;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/club/auth/login"); // Changed the route path
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="live" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
