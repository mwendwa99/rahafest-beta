import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UnderDevelopment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚧 Under Development</Text>
      <Text style={styles.subtitle}>
        We're working hard to bring you something amazing.
      </Text>
      <Text style={styles.description}>
        This feature is currently in development and will be available soon.
        Thank you for your patience.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "#666",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default UnderDevelopment;
