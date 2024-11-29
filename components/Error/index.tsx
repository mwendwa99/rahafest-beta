import React from "react";
import { Text } from "react-native";

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return <Text style={{ color: "red" }}>{message}</Text>;
}
