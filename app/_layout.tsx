import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import store, { persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="media" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
