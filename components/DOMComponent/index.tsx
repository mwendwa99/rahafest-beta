//@ts-nocheck
import React from "react";

import { useWindowDimensions } from "react-native";

import RenderHTML from "react-native-render-html";

import { LogBox } from "react-native";

LogBox.ignoreLogs(["TNodeChildrenRenderer: Support for defaultProps"]);

export default function DOMComponent({ html = "" }) {
  const { width } = useWindowDimensions();

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html }}
      baseStyle={{ color: "white" }}
    />
  );
}
