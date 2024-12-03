import React from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
  Image,
  ImageSourcePropType,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Variant = "text" | "contained" | "outlined";

interface IconButtonProps {
  // Allow either an Ionicons name or an image source
  name?: keyof typeof Ionicons.glyphMap;
  source?: ImageSourcePropType;
  size?: number;
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  edge?: "start" | "end" | false;
  enableFeedback?: boolean;
  variant?: Variant;
  title?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  name,
  source,
  size = 24,
  color = "#000000",
  disabled = false,
  onPress,
  style,
  edge = false,
  enableFeedback = true,
  variant = "text",
  title,
}) => {
  const getEdgeMargin = (): ViewStyle => {
    if (edge === "start") return { marginLeft: -12 };
    if (edge === "end") return { marginRight: -12 };
    return {};
  };

  const buttonSize = size + 16;
  const imageSize = size * 0.8; // Slightly smaller than the icon size for better visual balance

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "contained":
        return {
          backgroundColor: disabled ? "rgba(0, 0, 0, 0.12)" : color,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
            android: {
              elevation: 3,
            },
          }),
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled ? "rgba(0, 0, 0, 0.12)" : color,
          height: 60,
          width: 60,
        };
      case "text":
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getIconColor = () => {
    if (disabled) {
      return "rgba(0, 0, 0, 0.26)";
    }
    if (variant === "contained") {
      return "#ffffff";
    }
    return color;
  };

  const getRippleColor = () => {
    if (variant === "contained") {
      return "rgba(255, 255, 255, 0.24)";
    }
    return "rgba(0, 0, 0, 0.12)";
  };

  const renderIcon = () => {
    if (source) {
      return (
        <>
          <Image
            source={source}
            style={{
              width: imageSize,
              height: imageSize,
              resizeMode: "contain",
              opacity: variant === "contained" ? 1 : disabled ? 0.5 : 1,
              tintColor: variant === "contained" ? "#ffffff" : undefined,
            }}
          />
          {title && (
            <Text style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>
              {title}
            </Text>
          )}
        </>
      );
    }
    if (name) {
      return (
        <>
          <Ionicons name={name} size={size} color={getIconColor()} />{" "}
          {title && (
            <Text style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>
              {title}
            </Text>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          opacity: disabled
            ? 0.5
            : pressed && enableFeedback && variant !== "contained"
            ? 0.6
            : 1,
        },
        getVariantStyle(),
        getEdgeMargin(),
        style,
      ]}
      android_ripple={
        enableFeedback
          ? {
              color: getRippleColor(),
              borderless: variant === "text",
              radius: buttonSize / 2,
            }
          : null
      }
      disabled={disabled}
    >
      {renderIcon()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});

export default IconButton;
