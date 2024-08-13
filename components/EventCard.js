import React from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Text from "./Text";

const EventCard = ({ deal }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    banner,
    title,
    time,
    description,
    discount,
    oldPrice,
    newPrice,
    expired,
    tags,
  } = deal;

  useEffect(() => {
    if (user && token) {
      setIsAuthenticated(true);
    }
  }, [user, token]);

  console.log(JSON.stringify(deal));

  return (
    <View style={styles.container}>
      {/* Event Banner */}
      <Image source={{ uri: banner }} style={styles.banner} />

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text value={title} style={styles.eventName} variant="subtitle" />
        <FlatList
          data={tags}
          renderItem={({ item }) => (
            <View style={styles.chip}>
              <Text value={`${item.tag}`} variant={"small"} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <Text value={description} style={styles.eventTime} variant="body" />
      </View>

      {/* Discount and New Price */}
      {expired ? (
        <View style={styles.priceContainer}>
          <Text
            variant={"subtitle"}
            style={{ color: "red" }}
            value={"Expired"}
          />
          <Text style={styles.discount}>Expired</Text>
        </View>
      ) : (
        <View style={styles.priceContainer}>
          <Text style={styles.discount}>{discount}% OFF</Text>
          <Text style={styles.oldPrice}>KES {oldPrice}</Text>
          <Text style={styles.newPrice}>KES {newPrice}</Text>
        </View>
      )}
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
  chip: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 20,
    padding: 10,
    marginRight: 4,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  priceContainer: {
    alignItems: "flex-end",
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
