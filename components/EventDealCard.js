import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const EventCard = ({ deal }) => {
  return (
    <View style={styles.container}>
      {/* Event Banner */}
      <View>
        <Image source={deal.image} style={styles.banner} />
      </View>

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.eventName}>{deal.name}</Text>
        <Text style={styles.eventTime}>{deal.time}</Text>
        <Text style={styles.eventLocation}>{deal.location}</Text>
        <Text style={styles.ticketType}>{deal.ticketType}</Text>
      </View>

      {/* Discount and New Price */}
      <View style={styles.priceContainer}>
        <Text style={styles.discount}>{deal.discount}% OFF</Text>
        <Text style={styles.oldPrice}>KES {deal.oldPrice}</Text>
        <Text style={styles.newPrice}>KES {deal.newPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 12,
    margin: 5,
    width: 350,
    backgroundColor: "#fff",
    color: "#fafafa",
    borderRadius: 6,
    overflow: "hidden",
  },
  banner: {
    width: 100,
    height: 100,
  },
  detailsContainer: {
    flex: 2,
    marginLeft: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 12,
    color: "#666",
  },
  eventLocation: {
    fontSize: 13,
    color: "#1b1b1b",
  },
  ticketType: {
    fontSize: 12,
    color: "#C0C0C0",
  },
  priceContainer: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  discount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: "light",
    textDecorationLine: "line-through",
  },
  newPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EventCard;
