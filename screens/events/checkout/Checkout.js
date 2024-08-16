import { View, StyleSheet, Image, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text } from "../../../components";
import {
  formatCurrencyWithCommas,
  formatEventDates,
} from "../../../utils/helper";

export default function Checkout({ route }) {
  const { event } = route.params || {};

  console.log(event);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Image source={{ uri: event.banner }} style={styles.banner} />
        <View
          style={{
            flex: 1,
            marginLeft: 10,
          }}
        >
          <Text value={event.title} variant="subtitle" />
          <Text
            value={formatEventDates(event.start_date, event.end_date)}
            variant="body"
            style={{ marginVertical: 1 }}
          />
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="black"
            />
            <Text value={event.location} variant="body" />
          </View>
          <Text
            value={event.description}
            variant="small"
            style={{ marginVertical: 2 }}
          />
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <FlatList
          data={event.ticketTypes}
          renderItem={({ item }) => (
            <View style={styles.ticketItem}>
              <View style={styles.row}>
                <Text
                  value={item?.title || "N/A"}
                  variant="body"
                  style={{ fontWeight: "bold", marginRight: 2 }}
                />
                {item?.discount_price > 0 && (
                  <View style={styles.row}>
                    <Text
                      value={`${Math.round(item?.discount_rate)}% off`}
                      variant="body"
                      style={styles.discount}
                    />
                  </View>
                )}
              </View>
              <View style={styles.priceContainer}>
                {item?.discount_price > 0 ? (
                  <View style={styles.row}>
                    <Text
                      value={`KES ${formatCurrencyWithCommas(item?.price)}`}
                      variant="body"
                      style={styles.oldPrice}
                    />
                    <Text
                      value={`KES ${formatCurrencyWithCommas(
                        item?.discount_price
                      )}`}
                      variant="body"
                      style={styles.newPrice}
                    />
                  </View>
                ) : (
                  <Text
                    value={`KES ${formatCurrencyWithCommas(item?.price)}`}
                    variant="body"
                  />
                )}
              </View>
            </View>
          )}
          keyExtractor={(item) => item?.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  banner: {
    height: 250,
    width: 200,
    borderRadius: 4,
  },
  ticketItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
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
