import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import store, { persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "@/context/auth";

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const onBeforeLift = useCallback(async () => {
    // Called when PersistGate completes its rehydration process
    await SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={onBeforeLift}
        loading={null}
        persistor={persistor}
      >
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="media" />
          </Stack>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
