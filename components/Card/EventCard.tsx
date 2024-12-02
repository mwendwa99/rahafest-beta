import React from "react";
import { Image, View, StyleSheet, Pressable, Text } from "react-native";

interface CardProps {
  image: string;
  children: React.ReactNode;
  onPress?: () => void;
  expired: boolean;
}

export default function EventCard({
  expired,
  image,
  onPress,
  children,
}: CardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress} disabled={expired}>
      {expired && (
        <View style={styles.chip}>
          <Text style={styles.text}>expired</Text>
        </View>
      )}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.content}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    width: "100%",
    minHeight: 300,
    borderRadius: 20,
    marginVertical: 5,
    padding: 10,
  },
  chip: {
    backgroundColor: "#fafafa",
    width: 70,
    height: 30,
    display: "flex",
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c3c3c3",

    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 100,
  },
  text: {
    fontWeight: 700,
    fontSize: 12,
  },
  imageWrapper: {
    height: 200,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden", // Ensures the content respects the rounded corners
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover", // Ensures the image fills and crops excess
  },
  content: {
    marginVertical: 10,
  },
});
