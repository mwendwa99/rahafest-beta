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
  secureTextEntry,
  typePassword=false,
  isPasswordSecure,
  setIsPasswordSecure
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
      right={typePassword && 
        <TextInput.Icon
        icon={isPasswordSecure ? "eye-off" : "eye"}
        onPress={() => setIsPasswordSecure(!isPasswordSecure)}
        size={28}
        color="salmon"
      />
      }
    />
  );
}

const inputTheme = {
  colors: {
    background: "#e5e4e2",
  },
};
