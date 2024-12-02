import React from "react";
import { StyleSheet, TextStyle, View } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  style?: TextStyle;
  bgColor?: string;
};

export default function Container({
  style,
  children,
  bgColor,
}: ContainerProps) {
  return (
    <View
      style={[
        styles.container,
        style,
        bgColor ? { backgroundColor: bgColor } : null,
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
