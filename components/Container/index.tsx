import React from "react";
import { StyleSheet, TextStyle, View } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  style?: TextStyle;
  bgColor?: string;
  padding?: number;
};

export default function Container({
  style,
  children,
  bgColor,
  padding = 20,
}: ContainerProps) {
  return (
    <View
      style={[
        styles.container,
        style,
        { backgroundColor: bgColor ? bgColor : "#000", padding },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
