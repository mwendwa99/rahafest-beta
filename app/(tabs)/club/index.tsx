import React, { useEffect } from "react";
import { View, Button, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function ClubScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Button title="Go to Live" onPress={() => router.push("club/live")} />
    </View>
  );
}
