import { Text, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function CText({ value, variant, color, textStyle }) {
  const [fontsLoaded, fontError] = useFonts({
    "MamaKilo-Decorative": require("../assets/fonts/MamaKilo-Decorative.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log("Loading fonts...");
    return null;
  }
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Text
        style={{
          ...styles[variant],
          color: color ? color : "#fafafa",
          ...textStyle,
          fontFamily: "MamaKilo-Decorative",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    textTransform: "uppercase",
    lineHeight: 32,
  },
});
