import { StyleSheet, ImageBackground, View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";
import { useState, useEffect } from "react";

const splash = require("../../assets/splash.png");

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 1000); // Set a timeout for 1 second

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && !error && (
        <View style={styles.splashContainer}>
          <ImageBackground source={splash} style={styles.splash}>
            <StatusBar style="light" />
          </ImageBackground>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load content</Text>
          <Button title="Retry" onPress={handleLoadStart} />
        </View>
      )}
      {!loading && !error && (
        <View style={styles.webviewContainer}>
          <WebView
            onLoadStart={handleLoadStart}
            onLoad={handleLoad}
            onLoadEnd={handleLoad}
            onError={handleError}
            cacheEnabled={true}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            originWhitelist={["*"]}
            androidLayerType="hardware"
            source={{
              html: `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                      }
                      iframe {
                        border: none;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 1;
                      }
                    </style>
                  </head>
                  <body>
                    <iframe
                      src="https://ticketraha.com/events"
                      allowfullscreen
                      loading="lazy"
                    ></iframe>
                  </body>
                </html>
              `,
            }}
            style={styles.webview}
          />
        </View>
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
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splash: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    flex: 1,
    display: "flex",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212529",
  },
  errorText: {
    color: "white",
    marginBottom: 20,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
