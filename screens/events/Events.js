import {
  StyleSheet,
  ImageBackground,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { useState } from "react";

const splash = require("../../assets/splash.png");

export default function Checkout() {
  const [loading, setLoading] = useState(true);

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    setLoading(false); // Handle errors as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ImageBackground source={splash} style={styles.splash}>
          <ActivityIndicator size="large" color="#ffffff" />
          <StatusBar style="light" />
        </ImageBackground>
      )}
      <WebView
        onLoad={handleLoadEnd}
        onError={handleLoadError}
        source={{ uri: "https://ticketraha.com/events" }}
        style={styles.webview}
      />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
  },
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  webview: {
    flex: 1,
    opacity: 0.99, // Workaround for WebView rendering issues
  },
});
