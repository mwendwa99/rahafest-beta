// club/index.tsx
import React from "react";
import { View, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";

export default function ClubScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <Button title="Logout" onPress={logout} />
      <Button title="Go to Live" onPress={() => router.push("/live")} />
    </View>
  );
}
