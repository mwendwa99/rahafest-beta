import React, { useState, useEffect } from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";

const splash = require("../../assets/splash.png");

export default function Playlist() {
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ImageBackground source={splash} style={styles.splash}>
          <StatusBar style="light" />
        </ImageBackground>
      )}
      <View style={loading ? styles.hidden : styles.webviewContainer}>
        <WebView
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="margin: 0;">
                  <iframe style="border-radius:12px; object-fit:fill;" src="https://open.spotify.com/embed/playlist/1GW2VyfbDFFc0QtdHi5TGr?utm_source=generator" width="100%" height="100%" frameBorder="0" allow="fullscreen" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </body>
              </html>`,
          }}
          style={styles.webview}
        />
      </View>
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
  webviewContainer: {
    flex: 1,
    display: "flex",
  },
  hidden: {
    flex: 0,
    display: "none",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
