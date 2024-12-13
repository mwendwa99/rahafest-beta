import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function Input({ onChange, type, errorMessage, ...props }) {
  const handleTextChange = (text) => {
    if (type === "phone-pad" && text.length > 10) {
      text = text.slice(0, 10); // Limit to 10 characters
    }
    onChange(text);
  };

  return (
    <TextInput
      {...props}
      style={[styles.container, props.style]}
      mode="outlined"
      theme={inputTheme}
      onChangeText={handleTextChange}
      keyboardType={type}
      outlineStyle={styles.outline}
      error={!!errorMessage}
      returnKeyType="done"
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
    width: "100%",
    marginVertical: 5,
  },
  outline: {
    borderRadius: 10,
  },
});
