import React, { useCallback, useEffect } from "react";
import { Stack, useFocusEffect } from "expo-router";
import { useFriendships } from "@/hooks/useFriendhsip";

export default function MessagesLayout() {
  const { fetchUserFriends, isConnected } = useFriendships();

  // useEffect(() => {
  //   console.log("Fetching userFriends on component mount");
  //   fetchUserFriends();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      if (isConnected) {
        fetchUserFriends();
      }
      return () => {
        // Cleanup if needed
      };
    }, [isConnected, fetchUserFriends])
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Direct Messages",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#000", // Transparent background
          },
          headerTitleStyle: {
            color: "#fff", // White font color
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="friends"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
