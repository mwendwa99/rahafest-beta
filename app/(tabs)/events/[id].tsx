//@ts-nocheck
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import { formatEventDates } from "@/utils";
import DOMComponent from "@/components/DOMComponent";

export default function EventPage() {
  const { id, event } = useLocalSearchParams();

  const parsedEvent = event ? JSON.parse(event) : null;

  return (
    <Container style={styles.container}>
      <Image source={{ uri: parsedEvent?.banner }} height={200} />
      <View style={styles.row}>
        <Typography variant="h2">{parsedEvent.title}</Typography>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="location-outline" size={24} color={"grey"} />
          <Typography variant="body1" color="grey" style={{ fontSize: 18 }}>
            {parsedEvent?.location}
          </Typography>
        </View>
      </View>
      <View style={styles.row}>
        <Typography variant="body1" style={{ fontSize: 18 }}>
          {formatEventDates(parsedEvent?.start_date, parsedEvent?.end_date)}
        </Typography>
      </View>
      <View style={styles.column}>
        <Typography variant="h3" style={{ fontSize: 18 }}>
          About this event
        </Typography>
        <DOMComponent html={parsedEvent?.description} />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 10,
  },
  row: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  column: {
    marginVertical: 5,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
