//@ts-nocheck
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import DOMComponent from "@/components/DOMComponent";
import TicketList from "@/components/List/TicketList";
import { formatEventDates } from "@/utils";
import { fetchTicketTypes } from "@/store/app/appActions";
import Button from "@/components/Button";

export default function EventPage() {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const router = useRouter();

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

  const prepareSelectedTickets = () => {
    const selected = ticketTypes.filter((ticket) => quantities[ticket.id] > 0);
    if (selected.length === 0) {
      // Handle no tickets selected
      return null;
    }

    return selected.map((ticket) => ({
      ticketId: ticket.id,
      quantity: quantities[ticket.id],
      price: ticket.price,
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 120 : 0,
        }}
      >
        <Image
          source={{ uri: parsedEvent?.banner }}
          height={200}
          style={styles.image}
        />
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
        {ticketTypes && ticketTypes.length > 0 && (
          <Button
            onPress={() => {
              const selectedTickets = prepareSelectedTickets();
              if (!selectedTickets) {
                // Show alert or message that no tickets are selected
                alert("Please select tickets before proceeding");
                return;
              }

              router.push({
                pathname: `/events/form/${id}`,
                params: {
                  eventId: id,
                  tickets: JSON.stringify(selectedTickets),
                },
              });
            }}
          >
            Buy tickets
          </Button>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 10,
    flex: 1,
  },
  image: {
    borderRadius: 10,
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
