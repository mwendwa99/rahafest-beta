import React, { useCallback, useEffect } from "react";
import { router, Stack, useFocusEffect } from "expo-router";
import { useFriendships } from "@/hooks/useFriendhsip";
import IconButton from "@/components/IconButton";

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
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Friends",
        headerStyle: {
          backgroundColor: "#000", // Transparent background
        },
        headerTitleStyle: {
          color: "#fff", // White font color
        },
        headerTintColor: "#fff",
        headerLeft: (props) => (
          <IconButton
            name="chevron-back-outline"
            {...props}
            color="#fafafa"
            onPress={router.back}
          />
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="friendships" />
      <Stack.Screen name="dms" />
    </Stack>
  );
}
