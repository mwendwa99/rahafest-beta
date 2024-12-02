import React from "react";

import { useEffect } from "react";
import { View, Button } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/auth"; // We'll create this next

export default function ClubScreen() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("club/auth/login");
    }
  }, [isAuthenticated]);

  const handleNavigateToLive = () => {
    router.push("club/live");
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Go to Live" onPress={handleNavigateToLive} />
    </View>
  );
}
