import * as React from "react";
import { Avatar } from "react-native-paper";

export default function AvatarIcon({ size, icon, color, bgColor }) {
  return (
    <Avatar.Icon
      size={size}
      icon={icon}
      color={color}
      style={{ backgroundColor: bgColor }}
    />
  );
}
