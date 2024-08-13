import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const EventCard = ({ deal }) => {
  const {
    image,
    name,
    time,
    location,
    ticketType,
    discount,
    oldPrice,
    newPrice,
  } = deal;

  return (
    <View style={styles.container}>
      {/* Event Banner */}
      <Image source={image} style={styles.banner} />

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.eventName}>{name}</Text>
        <Text style={styles.eventTime}>{time}</Text>
        <Text style={styles.eventLocation}>{location}</Text>
        <Text style={styles.ticketType}>{ticketType}</Text>
      </View>

      {/* Discount and New Price */}
      <View style={styles.priceContainer}>
        <Text style={styles.discount}>{discount}% OFF</Text>
        <Text style={styles.oldPrice}>KES {oldPrice}</Text>
        <Text style={styles.newPrice}>KES {newPrice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 2,
  },
  banner: {
    width: 100,
    height: 100,
    borderRadius: 4,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
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
    alignItems: "flex-end",
  },
  discount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: "300",
    textDecorationLine: "line-through",
  },
  newPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EventCard;
