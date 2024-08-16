import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text, Input, UserInputForm } from "../../../components";

import {
  formatCurrencyWithCommas,
  formatEventDates,
  formatPhoneNumberToMpesaFormat,
} from "../../../utils/helper";
import { checkUserAuthentication } from "../../../redux/auth/authSlice";

export default function Checkout({ route }) {
  const { event } = route.params || {};
  const { user, token, error, loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  if (!event) {
    return (
      <View style={styles.container}>
        <Text value="Event not found" variant="body" />
      </View>
    );
  }

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text value="Loading..." variant="body" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    dispatch(checkUserAuthentication());
  }, []);

  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});

  const handleSelectTicketQuantity = (quantity, ticket) => {
    setTicketQuantities((prevQuantities) => {
      // Update the ticket quantities
      const updatedQuantities = { ...prevQuantities, [ticket.id]: quantity };
      const newAttendees = [];

      // Add new attendee entries based on the updated quantities
      Object.keys(updatedQuantities).forEach((ticketId) => {
        const qty = updatedQuantities[ticketId];
        if (qty > 0) {
          const ticket = event.ticketTypes.find(
            (t) => t.id === parseInt(ticketId, 10)
          );
          for (let i = 0; i < qty; i++) {
            newAttendees.push({
              ticket_name: ticket.title,
              event_name: event.title,
              first_name: user?.first_name || "", // or some default value
              last_name: user?.last_name || "", // or some default value
              phone: formatPhoneNumberToMpesaFormat(user?.phone || ""), // format phone number
              event_id: event.id,
              email: user?.email || "", // or some default value
              amount_paid:
                ticket.discount_price > 0
                  ? ticket.discount_price
                  : ticket.price,
              ticket_type: ticket.id,
            });
          }
        }
      });

      // Update attendeeInfo state
      setAttendeeInfo(newAttendees);

      return updatedQuantities;
    });
  };

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Image source={{ uri: event.banner }} style={styles.banner} />
        <View style={{ flex: 1, marginLeft: 10 }}>
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
              <View>
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
              <View>
                <Text value={`Select quantity`} variant="body" />
                <Input
                  placeholder="0"
                  type="number-pad"
                  defaultValue="0"
                  onChange={(text) => {
                    const quantity = parseInt(text, 10) || 0;
                    handleSelectTicketQuantity(quantity, item);
                  }}
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item?.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {isAuthenticated && (
        <View>
          {loading && (
            <Text
              value="Getting your information, please wait"
              variant="body"
            />
          )}
          <Text value="Your Information" variant="body" />
          <View
            style={{
              ...styles.ticketItem,
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Text
              value={`name: ${user?.first_name} ${user?.last_name}`}
              variant="body"
              style={{ color: "grey" }}
            />
            <Text
              value={`mobile: ${user?.phone || "unavailable"}`}
              variant="body"
              style={{ color: "grey" }}
            />
            <Text
              value={`email: ${user?.email}`}
              variant="body"
              style={{ color: "grey" }}
            />
          </View>
        </View>
      )}

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
