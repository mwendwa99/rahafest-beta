import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AvatarProps {
  names: string;
  width: number;
  height: number;
  fontSize: number;
}

export default function Avatar({
  names,
  width = 200,
  height = 200,
  fontSize = 50,
}: AvatarProps) {
  // Extract initials
  const initials = names
    .split(",") // Split the names string into an array
    .map((name) => name.trim().charAt(0).toUpperCase()) // Get the first letter of each name
    .join(""); // Join the initials

  // Generate a unique color based on the initials
  const hashCode = initials
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0); // Generate a simple hash
  const color = `hsl(${hashCode % 360}, 70%, 60%)`; // Create a color from the hash

  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: color, width, height, fontSize },
      ]}
    >
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100, // Makes it circular
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc", // Default background color
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
