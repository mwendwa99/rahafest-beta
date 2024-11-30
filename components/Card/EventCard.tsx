import React from "react";
import { Image, View, StyleSheet, Pressable } from "react-native";

interface CardProps {
  image: string;
  children: React.ReactNode;
  onPress?: () => void;
}

export default function EventCard({ image, onPress, children }: CardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
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
