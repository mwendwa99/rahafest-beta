//@ts-nocheck
import React from "react";
import { View, StyleSheet } from "react-native";
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
    <View
      style={[
        styles.cardContainer,
        { width: isFullWidth ? "100%" : "48%" }, // Full width for single items
      ]}
    >
      <IconButton
        name={icon}
        size={iconSize}
        color={color}
        title={title}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    height: 150,
    backgroundColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Adds spacing between rows
  },
});
