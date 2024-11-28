import React from "react";
import { StyleSheet, TextStyle, View } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  style?: TextStyle;
};

export default function Container({ style, children }: ContainerProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
