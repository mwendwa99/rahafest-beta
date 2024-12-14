import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";

import {
  Text,
  UserInfoCard,
  TicketCard,
  Button,
  ModalComponent,
  PhoneInput,
  PaymentModal,
  UserForm,
} from "../../../components";

import {
  formatEventDates,
  formatPhoneNumberToMpesaFormat,
  getTime,
} from "../../../utils/helper";
import { checkUserAuthentication } from "../../../redux/auth/authSlice";
import { createInvoice } from "../../../redux/events/eventActions";
import {
  clearInvoiceError,
  clearPaymentData,
} from "../../../redux/events/eventSlice";
import { success, warning } from "../../../utils/toast";
import WebView from "react-native-webview";

export default function Checkout({ route, navigation }) {
  const { event, showDiscount } = route.params || {};
  const { user } = useSelector((state) => state.auth);

  const [userInfo, setUserInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [ticketInfo, setTicketInfo] = useState({
    ticket_type: null,
    quantity: 0,
    amount_paid: 0,
  });
  const [data, setData] = useState({
    event: event?.id,
    ticket_type: null,
    email: null,
    first_name: userInfo.email,
    last_name: null,
    phone: null,
    amount_paid: null,
    RF_id: null,
  });

  const validateUserInfo = () => {
    if (!userInfo.email) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleBuyTicket = () => {
    if (!validateUserInfo()) {
      console.log("User info missing");
      return;
    }

    setData((prev) => ({
      ...prev,
      email: userInfo.email,
      first_name: userInfo.first_name || "",
      last_name: userInfo.last_name || "",
      phone: userInfo.phone || "",
    }));

    // Update attendeeInfo based on quantity
    const attendeeDetails = Array(ticketInfo.quantity)
      .fill()
      .map((_, index) => ({
        ...data,
        ...ticketInfo,
        RF_id: null,
      }));

    setAttendeeInfo(attendeeDetails);
    console.log("Attendee Info Updated:", attendeeDetails);
  };

  // console.log({ userInfo });

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
            onClose={() => setShowModal(false)}
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
                    ticketInfo={ticketInfo}
                    setTicketInfo={setTicketInfo}
                    // handleSelectTicketQuantity={handleSelectTicketQuantity}
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
          label="Buy Ticket"
          variant={"contained"}
          onPress={handleBuyTicket}
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
