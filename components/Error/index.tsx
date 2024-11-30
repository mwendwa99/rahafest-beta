import React from "react";
import { Text, StyleSheet } from "react-native";

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "red",
    fontWeight: 700,
    fontSize: 24,
  },
});
