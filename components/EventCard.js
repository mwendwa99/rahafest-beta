import React, { useState, useEffect, useCallback } from "react";
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

const EventCard = React.memo(
  ({ event, ticketTypes = [], isAuthenticated, handleNavigate }) => {
    const {
      banner = "",
      title = "No Title Available",
      location = "Location not available",
      expired = false,
      start_date,
      end_date,
    } = event || {};

    const [prices, setPrices] = useState([]);

    const ensureHttps = useCallback((url) => {
      if (typeof url !== "string") return "";
      return url.startsWith("http://")
        ? url.replace("http://", "https://")
        : url;
    }, []);

    useEffect(() => {
      if (Array.isArray(ticketTypes) && ticketTypes.length > 0) {
        const updatedPrices = ticketTypes.map((item) => {
          const originalPrice = parseFloat(item?.price || 0);
          const discountedPrice = parseFloat(item?.discount_price || 0);
          return { ...item, originalPrice, discountedPrice };
        });
        setPrices(updatedPrices);
      }
    }, [ticketTypes]);

    const navigateToCheckout = () => {
      handleNavigate({
        ...event,
        ticketTypes: prices,
      });
    };

    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: ensureHttps(banner) || "https://via.placeholder.com/200",
          }}
          style={styles.banner}
        />
        {expired && (
          <View style={styles.expiredBadge}>
            <Text value={"Sales Ended"} variant="subtitle" />
          </View>
        )}
        <View style={styles.cardInfoContainer}>
          <TouchableOpacity
            disabled={expired}
            style={styles.cardInfo}
            onPress={navigateToCheckout}
          >
            <View>
              <Text value={title} variant="subtitle" />
              <Text
                value={
                  formatEventDates(start_date, end_date) || "Date not available"
                }
                variant="body"
                style={styles.dateText}
              />
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <View style={styles.detailsContainer}>
            <View style={{ ...styles.row, flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={20}
                color="black"
              />
              <Text value={location} variant="body" />
            </View>
          </View>
          {prices.length > 0 && !expired && (
            <View style={styles.detailsContainer}>
              <FlatList
                data={prices}
                renderItem={({ item }) => (
                  <View style={styles.ticketItem}>
                    <View style={styles.row}>
                      <Text
                        value={item?.title || "N/A"}
                        variant="body"
                        style={styles.ticketTitle}
                      />
                      {isAuthenticated && item?.discount_rate > 0 && (
                        <Text
                          value={`${Math.round(item.discount_rate)}% off`}
                          variant="body"
                          style={styles.discount}
                        />
                      )}
                    </View>
                    <View style={styles.priceContainer}>
                      {item?.discountedPrice > 0 ? (
                        <View style={styles.row}>
                          <Text
                            value={`KES ${formatCurrencyWithCommas(
                              item?.originalPrice || 0
                            )}`}
                            variant="body"
                            style={styles.oldPrice}
                          />
                          <Text
                            value={`KES ${formatCurrencyWithCommas(
                              item?.discountedPrice.toFixed(2) || 0
                            )}`}
                            variant="body"
                            style={styles.newPrice}
                          />
                        </View>
                      ) : (
                        <Text
                          value={`KES ${formatCurrencyWithCommas(
                            item?.originalPrice || 0
                          )}`}
                          variant="body"
                        />
                      )}
                    </View>
                  </View>
                )}
                keyExtractor={(item) =>
                  item?.id ? item.id.toString() : Math.random().toString()
                }
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
);
const styles = StyleSheet.create({
  container: {
    position: "relative",
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
    height: 200,
    borderRadius: 8,
  },
  expiredBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 50,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    margin: 10,
  },
  cardInfoContainer: {
    flex: 1,
    padding: 10,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dateText: {
    marginVertical: 5,
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
  ticketTitle: {
    fontWeight: "bold",
    marginRight: 2,
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
