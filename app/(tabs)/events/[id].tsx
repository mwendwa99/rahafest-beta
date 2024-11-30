//@ts-nocheck
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import { formatEventDates } from "@/utils";
import DOMComponent from "@/components/DOMComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketTypes } from "@/store/app/appActions";
import TicketList from "@/components/List/TicketList";

export default function EventPage() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const { id, event } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { ticketTypes } = useSelector((state) => state.app);

  const parsedEvent = event ? JSON.parse(event) : null;

  useEffect(() => {
    dispatch(fetchTicketTypes(id));
  }, [id]);

  return (
    <Container style={styles.container}>
      <ScrollView>
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
        <View style={styles.column}>
          <Typography variant="h3" style={{ fontSize: 18 }}>
            Events
          </Typography>
          {ticketTypes &&
            ticketTypes.map((ticket) => (
              <TicketList
                key={ticket.id}
                title={ticket.title}
                price={ticket.price}
                quantity={quantities[ticket.id] || 0}
                setQuantity={(quantity) =>
                  handleQuantityChange(ticket.id, quantity)
                }
              />
            ))}
        </View>
      </ScrollView>
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
