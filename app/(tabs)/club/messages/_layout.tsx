import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useFriendships } from "@/hooks/useFriendhsip";

export default function MessagesLayout() {
  const { fetchUserFriends } = useFriendships();

  useEffect(() => {
    console.log("Fetching userFriends on component mount");
    fetchUserFriends();
  }, []);

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
