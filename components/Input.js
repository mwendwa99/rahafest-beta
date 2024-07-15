import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function Input({ onChange, type, ...props }) {
  return (
    <TextInput
      {...props}
      style={styles.container}
      mode="outlined"
      theme={inputTheme}
      onChangeText={onChange}
      keyboardType={type}
      outlineStyle={styles.outline}
    />
  );
}

const inputTheme = {
  colors: {
    background: "#e5e4e2",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  outline: {
    borderRadius: 10,
  },
});
