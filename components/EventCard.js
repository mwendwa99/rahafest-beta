import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Text from "./Text";
import { formatEventDates, formatCurrencyWithCommas } from "../utils/helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EventCard = ({ event, ticketTypes, isAuthenticated, handleNavigate }) => {
  const { banner, title, location, expired, start_date, end_date } = event;
  const [prices, setPrices] = useState([]);

  // //test data
  // useEffect(() => {
  //   // Example data manipulation for testing
  //   const simulatedTicketTypes = [
  //     {
  //       id: 1,
  //       title: "Regular",
  //       price: "6000.00",
  //       discount_price: "5000.00", // Discounted price
  //       discount_rate: "10.00",
  //       available_tickets: 120,
  //       event_id: 7,
  //       is_active: true,
  //       count: 0,
  //       total_tickets: 120,
  //       remaining_tickets: 120,
  //       revenue: "0.00",
  //     },
  //     {
  //       id: 2,
  //       title: "VIP",
  //       price: "10000.00",
  //       discount_price: "9000.00", // Discounted price
  //       discount_rate: "10.00",
  //       available_tickets: 50,
  //       event_id: 7,
  //       is_active: true,
  //       count: 0,
  //       total_tickets: 50,
  //       remaining_tickets: 50,
  //       revenue: "0.00",
  //     },
  //   ];

  //   const calculatePrices = () => {
  //     const updatedPrices =
  //       simulatedTicketTypes &&
  //       simulatedTicketTypes.length > 0 &&
  //       simulatedTicketTypes.map((item) => {
  //         const originalPrice = parseFloat(item.price);
  //         const discountedPrice = parseFloat(item.discount_price);
  //         return { ...item, originalPrice, discountedPrice };
  //       });
  //     setPrices(updatedPrices);
  //   };

  //   calculatePrices();
  // }, [ticketTypes]);

  useEffect(() => {
    const calculatePrices = () => {
      const updatedPrices =
        ticketTypes &&
        ticketTypes.length > 0 &&
        ticketTypes.map((item) => {
          const originalPrice = parseFloat(item.price); // Ensure price is a number
          const discountedPrice = parseFloat(item.discount_price); // Use discount_price directly
          return { ...item, originalPrice, discountedPrice };
        });
      setPrices(updatedPrices);
    };

    calculatePrices();
  }, [ticketTypes]);

  const navigateToCheckout = () => {
    const eventDetails = {
      ...event,
      ticketTypes: prices,
      // tickets: prices, // Pass the updated ticket prices
    };

    handleNavigate(eventDetails);
  };

  return (
    <View style={styles.container} disabled={expired}>
      {/* Event Banner */}
      <Image source={{ uri: banner }} style={styles.banner} />

      <View style={styles.cardInfoContainer}>
        {/* Event Details */}
        <TouchableOpacity
          disabled={expired}
          style={{
            ...styles.row,
            justifyContent: "space-between",
            width: "100%",
          }}
          onPress={navigateToCheckout}
        >
          <View>
            <Text value={title} variant="subtitle" />
            <Text
              value={formatEventDates(start_date, end_date)}
              variant="body"
              style={{ marginVertical: 5 }}
            />
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {/* Event Location */}
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="black"
            />
            <Text value={location} variant="body" />
          </View>
        </View>

        {/* Ticket Types */}
        {prices.length > 0 && !expired && (
          <View style={styles.detailsContainer}>
            <FlatList
              data={prices}
              renderItem={({ item }) => (
                <View style={styles.ticketItem}>
                  <View style={styles.row}>
                    <Text
                      value={item.title}
                      variant="body"
                      style={{ fontWeight: "bold", marginRight: 2 }}
                    />
                    {isAuthenticated && item.discount_rate > 0 && (
                      <View style={styles.row}>
                        <Text
                          value={`${Math.round(item.discount_rate)}% off`}
                          variant="body"
                          style={styles.discount}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.priceContainer}>
                    {item.discountedPrice > 0 && (
                      <View style={styles.row}>
                        <Text
                          value={`KES ${formatCurrencyWithCommas(
                            item.originalPrice
                          )}`}
                          variant="body"
                          style={styles.oldPrice}
                        />
                        <Text
                          value={`KES ${formatCurrencyWithCommas(
                            item.discountedPrice.toFixed(2)
                          )}`}
                          variant="body"
                          style={styles.newPrice}
                        />
                      </View>
                    )}
                    {item.discountedPrice === 0 && (
                      <Text
                        value={`KES ${formatCurrencyWithCommas(
                          item.originalPrice
                        )}`}
                        variant="body"
                      />
                    )}
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 2,
  },
  banner: {
    width: "100%",
    height: 250,
    borderRadius: 4,
    marginRight: 10,
  },
  cardInfoContainer: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  ticketItem: {
    marginRight: 10,
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: "300",
    textDecorationLine: "line-through",
    color: "grey",
    marginEnd: 5,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  discountImage: {
    width: 20,
    height: 20,
    marginEnd: 2,
  },
  discount: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default EventCard;
