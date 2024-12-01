import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const Button = ({
  onPress,
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return "#e0e0e0";
    if (variant === "outlined") return "transparent";

    switch (color) {
      case "primary":
        return "#FE1648";
      case "secondary":
        return "#9c27b0";
      case "error":
        return "#d32f2f";
      case "success":
        return "#2e7d32";
      default:
        return "#1976d2";
    }
  };

  const getBorderColor = () => {
    if (disabled) return "#bdbdbd";
    return getBackgroundColor();
  };

  const getTextColor = () => {
    if (disabled) return "#757575";
    if (variant === "outlined") return getBorderColor();
    return variant === "contained" ? "#ffffff" : getBackgroundColor();
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 6, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 12, paddingHorizontal: 24 };
      default: // medium
        return { paddingVertical: 8, paddingHorizontal: 20 };
    }
  };

  const buttonStyles = StyleSheet.create({
    button: {
      borderRadius: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: getBackgroundColor(),
      borderWidth: variant === "outlined" ? 1 : 0,
      borderColor: getBorderColor(),
      opacity: disabled ? 0.7 : 1,
      width: fullWidth ? "100%" : "auto",
      ...getPadding(),
    },
    text: {
      color: getTextColor(),
      fontSize: size === "small" ? 13 : size === "large" ? 16 : 14,
      fontWeight: "500",
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyles.button, style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "contained" ? "#ffffff" : getBackgroundColor()}
        />
      ) : (
        <Text style={[buttonStyles.text, textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
