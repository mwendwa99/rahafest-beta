import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function Input({
  onChange,
  defaultValue,
  type,
  inputStyle,
  multiline,
  numberOfLines,
  secureTextEntry
}) {
  return (
    <TextInput
      mode="outlined"
      placeholder={defaultValue}
      outlineColor="#fff"
      textColor="#000000"
      placeholderTextColor="#71797e"
      style={inputStyle}
      theme={inputTheme}
      onChangeText={onChange}
      keyboardType={type}
      multiline={multiline}
      numberOfLines={numberOfLines}
      secureTextEntry={secureTextEntry}
    />
  );
}

const inputTheme = {
  colors: {
    background: "#e5e4e2",
  },
};
