import React from "react";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import { useLocalSearchParams } from "expo-router";

export default function DMPage() {
  const { friendId } = useLocalSearchParams();
  return (
    <Container bgColor="#000">
      <Typography variant="h1">friend id{friendId}</Typography>
    </Container>
  );
}
