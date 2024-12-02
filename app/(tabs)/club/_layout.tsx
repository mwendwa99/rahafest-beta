//@ts-nocheck
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/auth";

export default function ClubLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/club/auth/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if (!isAuthenticated) {
  //   return null; // Block rendering until redirect is complete
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
}
