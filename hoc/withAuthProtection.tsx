import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/auth";

export function withAuthProtection(Component: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/club/auth/login");
      }
    }, [isLoading, isAuthenticated]);

    if (isLoading || !isAuthenticated) {
      // Show a loading screen or nothing while redirecting
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return <Component {...props} />;
  };
}
