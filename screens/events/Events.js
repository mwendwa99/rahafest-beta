import { StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { useState, useEffect } from "react";

const splash = require("../../assets/splash.png");

export default function Checkout() {
  const [loading, setLoading] = useState(true);

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleLoadError = () => {
    setLoading(false); // You might want to handle errors differently
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ImageBackground
          source={splash}
          style={{ flex: 1, justifyContent: "center", height: "100vh" }}
        >
          <StatusBar style="light" />
        </ImageBackground>
      ) : (
        // Display the iframe after loading is complete
        <WebView
          onLoad={handleLoadEnd}
          onError={handleLoadError}
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body style="margin: 0;">
                  <iframe
                    style="border-radius:12px; object-fit:cover; width: 100%; height: 100%;"
                    src="https://tickoh.netlify.app/raha-events"
                    frameBorder="0"
                    allow="fullscreen"
                    loading="lazy"
                  ></iframe>
                </body>
              </html>
            `,
          }}
        />
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212529",
  },
});
