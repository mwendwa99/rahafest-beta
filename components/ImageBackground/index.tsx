import React from "react";
import { ImageBackground as RNImgBg, StyleSheet } from "react-native";

interface ImageBackgroundProps {
  uri: string;
  children: React.ReactNode;
}

export default function ImageBackground({
  uri,
  children,
}: ImageBackgroundProps) {
  return (
    // {/* @ts-ignore */}
    <RNImgBg source={uri} style={styles.image}>
      {children}
    </RNImgBg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
