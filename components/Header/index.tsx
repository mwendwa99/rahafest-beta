import React from "react";
import { Text, TextStyle, View } from "react-native";

interface HeaderProps {
  title: string;
  style?: TextStyle;
}

export default function Header({ title, style }: HeaderProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={[
          style,
          { fontSize: 18, textTransform: "capitalize", fontWeight: "bold" },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}
