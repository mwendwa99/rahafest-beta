//@ts-nocheck
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import IconButton from "../IconButton";

interface NavCardProp {
  color: string;
  icon: string;
  isFullWidth: boolean;
  title: string;
  iconSize: number;
  onPress: () => void;
}

export default function NavCard({
  color,
  icon,
  iconSize,
  isFullWidth,
  title,
  onPress,
}: NavCardProp) {
  return (
    <Pressable
      style={[
        styles.cardContainer,
        { width: isFullWidth ? "100%" : "48%", borderColor: color }, // Full width for single items
      ]}
      onPress={onPress}
    >
      <IconButton
        name={icon}
        size={iconSize}
        color={color}
        title={title}
        onPress={onPress}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    height: 150,
    backgroundColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Adds spacing between rows
  },
});
