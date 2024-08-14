import React from "react";
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

const EventCard = ({ event, ticketTypes, isAuthenticated }) => {
  const { banner, title, location, expired, start_date, end_date } = event;

  const discountPercentage =
    isAuthenticated && !expired ? Math.floor(Math.random() * 10) : 0;

  return (
    <View style={styles.container} disabled={expired}>
      {/* Event Banner */}
      <Image source={{ uri: banner }} style={styles.banner} />

      {/* Event Details */}
      <View style={styles.cardInfoContainer}>
        <TouchableOpacity
          disabled={expired}
          style={{
            ...styles.row,
            justifyContent: "space-between",
            width: "100%",
          }}
          onPress={() => alert("Update coming soon!")}
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
          {isAuthenticated && discountPercentage > 0 && (
            <View style={styles.row}>
              <Image
                source={require("../assets/discount.png")}
                style={styles.discountImage}
              />
              <Text
                value={`${discountPercentage}% membership discount`}
                variant="body"
                style={styles.discount}
              />
            </View>
          )}
        </View>

        {/* Ticket Types */}
        {ticketTypes.length > 0 && !expired && (
          <View style={styles.detailsContainer}>
            <FlatList
              data={[...ticketTypes, ...ticketTypes]}
              renderItem={({ item }) => {
                const originalPrice = item.price;
                const discountedPrice =
                  originalPrice - (originalPrice * discountPercentage) / 100;

                return (
                  <View style={styles.ticketItem}>
                    <Text
                      value={item.title}
                      variant="body"
                      style={{ fontWeight: "bold" }}
                    />
                    <View style={styles.priceContainer}>
                      {discountPercentage > 0 && (
                        <View style={styles.row}>
                          <Text
                            value={`KES ${formatCurrencyWithCommas(
                              originalPrice
                            )}`}
                            variant="body"
                            style={styles.oldPrice}
                          />
                          <Text
                            value={`KES ${formatCurrencyWithCommas(
                              discountedPrice.toFixed(2)
                            )}`}
                            variant="body"
                            style={styles.newPrice}
                          />
                        </View>
                      )}
                      {discountPercentage === 0 && (
                        <Text
                          value={`KES ${formatCurrencyWithCommas(
                            originalPrice
                          )}`}
                          variant="body"
                        />
                      )}
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
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
});

export default EventCard;
