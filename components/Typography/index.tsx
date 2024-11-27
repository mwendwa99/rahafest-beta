import React from "react";
import { Text, TextStyle, StyleSheet } from "react-native";

type Variant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "caption"
  | "overline";

interface TypographyProps {
  variant?: Variant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
  children: React.ReactNode;
  style?: TextStyle;
  gutterBottom?: boolean;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  color,
  align = "left",
  children,
  style,
  gutterBottom = false,
}) => {
  return (
    <Text
      style={[
        styles[variant],
        {
          color,
          textAlign: align,
          marginBottom: gutterBottom ? 8 : 0,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 24,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  subtitle2: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default Typography;
