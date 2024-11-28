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
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    width: 380,
    minHeight: 300,
    borderRadius: 8,
    margin: 7,
    padding: 10,
  },
  image: { height: 200, width: "100%", borderRadius: 10 },
  content: {
    marginVertical: 10,
  },
});
