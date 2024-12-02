// club/index.tsx
import React from "react";
import { View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function ClubScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Button title="Go to Live" onPress={() => router.push("/live")} />
    </View>
  );
}
