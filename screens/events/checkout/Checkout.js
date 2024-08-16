import { View, StyleSheet, Image, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text } from "../../../components";
import { formatEventDates } from "../../../utils/helper";

export default function Checkout({ route }) {
  const { event } = route.params || {};

  // console.log(event);

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
      {/* <View style={{}}>
          <FlatList
            data={prices}
            renderItem={({ item }) => (
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
                  {discountPercentage === 0 && (
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
        </View> */}
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
});
