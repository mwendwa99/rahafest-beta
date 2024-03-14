import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

const Input = ({
  onChange,
  defaultValue,
  type,
  theme,
  inputStyle,
  multiline,
  numberOfLines,
}) => {
  return !theme ? (
    <TextInput
      mode="outlined"
      placeholder={defaultValue}
      outlineColor="#fff"
      textColor="#000000"
      placeholderTextColor="#71797e"
      style={{ ...styles.input, inputStyle }}
      theme={inputTheme}
      onChangeText={onChange}
      keyboardType={type}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  ) : (
    <TextInput
      label={defaultValue}
      mode="outlined"
      placeholder={defaultValue}
      outlineColor="#002a0c"
      textColor="#000000"
      placeholderTextColor="#71797e"
      style={{ ...styles.input, ...inputStyle }}
      theme={inputTheme}
      onChangeText={onChange}
      keyboardType={type}
    />
  );
};

const inputTheme = {
  colors: {
    primary: "#002a0c",
    text: "#002a0c",
    placeholder: "#002a0c",
    background: "#e5e4e2",
  },
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#fafafa",
    textTransform: "uppercase",
  },
  input: {
    marginBottom: 4,
    borderRadius: 5,
    backgroundColor: "#fafafa",
  },
});

export default Input;
