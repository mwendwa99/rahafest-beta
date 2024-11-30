//@ts-nocheck
import React from "react";

import { useWindowDimensions } from "react-native";

import RenderHTML from "react-native-render-html";

export default function DOMComponent({ html }) {
  const { width } = useWindowDimensions();

  const source2 = {
    html,
  };

  return (
    <RenderHTML
      contentWidth={width}
      source={source2}
      baseStyle={{ color: "white" }}
    />
  );
}
