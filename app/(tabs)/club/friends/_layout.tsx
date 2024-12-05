import React, { useCallback, useEffect } from "react";
import { router, Stack, useFocusEffect } from "expo-router";
import { useFriendships } from "@/hooks/useFriendhsip";
import IconButton from "@/components/IconButton";

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="friendships" />
      <Stack.Screen name="dms" />
    </Stack>
  );
}
