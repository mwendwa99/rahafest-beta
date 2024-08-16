import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, FlatList, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Text,
  UserInfoCard,
  TicketCard,
  Button,
  UserInputForm,
} from "../../../components";

import {
  formatEventDates,
  formatPhoneNumberToMpesaFormat,
} from "../../../utils/helper";
import { checkUserAuthentication } from "../../../redux/auth/authSlice";

export default function Checkout({ route }) {
  const { event } = route.params || {};
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [showUserInputModal, setShowUserInputModal] = useState(false);
  const [showPhoneInputModal, setShowPhoneInputModal] = useState(false);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text value="Event not found" variant="body" />
      </View>
    );
  }

  useEffect(() => {
    dispatch(checkUserAuthentication());
  }, []);

  const handleSelectTicketQuantity = (quantity, ticket) => {
    if (!isAuthenticated) {
      setShowUserInputModal(true);
      return;
    }

    if (isAuthenticated && !user?.phone) {
      setShowPhoneInputModal(true);
      return;
    }

    // Proceed with updating the ticket quantities and attendee info
    setTicketQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities, [ticket.id]: quantity };
      const newAttendees = [];

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

      setAttendeeInfo(newAttendees);

      return updatedQuantities;
    });
  };

  // const handleSelectTicketQuantity = (quantity, ticket) => {
  //   setTicketQuantities((prevQuantities) => {
  //     // Update the ticket quantities
  //     const updatedQuantities = { ...prevQuantities, [ticket.id]: quantity };
  //     const newAttendees = [];

  //     // Add new attendee entries based on the updated quantities
  //     Object.keys(updatedQuantities).forEach((ticketId) => {
  //       const qty = updatedQuantities[ticketId];
  //       if (qty > 0) {
  //         const ticket = event.ticketTypes.find(
  //           (t) => t.id === parseInt(ticketId, 10)
  //         );
  //         for (let i = 0; i < qty; i++) {
  //           newAttendees.push({
  //             ticket_name: ticket.title,
  //             event_name: event.title,
  //             first_name: user?.first_name || "", // or some default value
  //             last_name: user?.last_name || "", // or some default value
  //             phone: formatPhoneNumberToMpesaFormat(user?.phone || ""), // format phone number
  //             event_id: event.id,
  //             email: user?.email || "", // or some default value
  //             amount_paid:
  //               ticket.discount_price > 0
  //                 ? ticket.discount_price
  //                 : ticket.price,
  //             ticket_type: ticket.id,
  //           });
  //         }
  //       }
  //     });

  //     // Update attendeeInfo state
  //     setAttendeeInfo(newAttendees);

  //     return updatedQuantities;
  //   });
  // };

  console.log("attendeeInfo", attendeeInfo);
  // console.log("user", user);

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
            <TicketCard
              item={item}
              handleSelectTicketQuantity={handleSelectTicketQuantity}
            />
          )}
          keyExtractor={(item) => item?.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {isAuthenticated && <UserInfoCard loading={loading} user={user} />}

      <View>
        <Button
          label="Buy Ticket"
          variant={"contained"}
          onPress={() => alert("Pay Now", attendeeInfo)}
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
