import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Text,
  TicketCard,
  Button,
  ModalComponent,
  PaymentModal,
  UserForm,
} from "../../../components";

import { formatEventDates, getTime } from "../../../utils/helper";
// import { createInvoice } from "../../../redux/events/eventActions";
import WebView from "react-native-webview";

export default function Checkout({ route, navigation }) {
  const { event, showDiscount } = route.params || {};

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const initial_user_info_data = {
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  };

  const [userInfo, setUserInfo] = useState(initial_user_info_data);
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [ticketSelections, setTicketSelections] = useState({});

  const totalTickets = Object.values(ticketSelections).reduce(
    (sum, ticket) => sum + (ticket.quantity || 0),
    0
  );

  const handleBuyTicket = (updatedUserInfo = userInfo) => {
    if (totalTickets <= 0) {
      alert("Please select at least one ticket");
      return;
    }

    const baseData = {
      event: event?.id,
      email: updatedUserInfo.email,
      first_name: updatedUserInfo.first_name || "",
      last_name: updatedUserInfo.last_name || "",
      phone: updatedUserInfo.phone || "",
    };

    // Create attendee details for each ticket type
    const attendeeDetails = Object.values(ticketSelections).reduce(
      (acc, ticket) => {
        if (ticket.quantity > 0) {
          const ticketAttendees = Array(ticket.quantity)
            .fill(null)
            .map(() => ({
              ...baseData,
              ticket_type: ticket.ticket_type,
              amount_paid: ticket.amount_paid,
              RF_id: null,
            }));
          return [...acc, ...ticketAttendees];
        }
        return acc;
      },
      []
    );

    const transformedApiData = {
      data: {
        attendeeInfo: attendeeDetails,
      },
      source_application: 2,
    };

    dispatch(createInvoice(transformedApiData));
    setShowInvoiceModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* user info modal */}
      {showModal && (
        <ModalComponent
          visible={showModal}
          toggleModal={() => setShowModal(false)}
          transparent={false}
        >
          <UserForm
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            onClose={(updatedUserInfo) => {
              setShowModal(false);
              setUserInfo(updatedUserInfo); // Update the state synchronously
              handleBuyTicket(updatedUserInfo); // Pass updatedUserInfo
            }}
          />
        </ModalComponent>
      )}

      {showInvoiceModal && (
        <ModalComponent
          visible={showInvoiceModal}
          toggleModal={() => setShowInvoiceModal(!showInvoiceModal)}
          transparent={false}
        >
          <PaymentModal
            navigation={navigation}
            invoice={invoice}
            toggleModal={() => setShowInvoiceModal(!showInvoiceModal)}
          />
        </ModalComponent>
      )}

      <ScrollView>
        <View style={styles.row}>
          <Image source={{ uri: event.banner }} style={styles.banner} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text value={event.title} variant="subtitle" />
            <Text
              value={`${formatEventDates(event.start_date, event.end_date)}`}
              variant="body"
              style={{ marginVertical: 3 }}
            />
            <Text
              value={`${getTime(event.start_date) || "TBD"} to ${
                getTime(event.end_date) || "TBD"
              }`}
              variant="body"
              style={{ marginVertical: 3 }}
            />
            <View style={styles.row}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={20}
                color="black"
              />
              <Text value={event.location} variant="body" />
            </View>
            {event?.description && (
              <WebView
                originWhitelist={["*"]}
                source={{
                  html: `<html><body style="font-size:50px; font-family:Montserrat;">${event.description}</body></html>`,
                }}
              />
            )}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          {event.ticket_types && event.ticket_types.length > 0 ? (
            <View>
              {event.ticket_types
                .filter(
                  (event) =>
                    event.is_active &&
                    event.id !== 22 &&
                    event.is_rahaclub_vip === showDiscount
                )
                .map((item) => (
                  <TicketCard
                    key={item.id.toString()}
                    item={item}
                    ticketSelections={ticketSelections}
                    setTicketSelections={setTicketSelections}
                  />
                ))}
            </View>
          ) : (
            <Text
              value="Tickets will be available soon!"
              variant="body"
              style={{
                marginVertical: 10,
                color: "black",
                textAlign: "center",
              }}
            />
          )}
        </View>
        <Button
          disabled={event.location === "TBA"}
          label={loading ? "Loading..." : "Buy Ticket"}
          variant={"contained"}
          onPress={() => {
            if (totalTickets <= 0) {
              alert("Please select at least one ticket");
              return;
            }
            setShowModal(true);
          }}
        />
      </ScrollView>
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
    height: 200,
    width: 200,
    borderRadius: 8,
  },
});
