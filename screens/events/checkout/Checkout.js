import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const {
    invoice,
    invoiceError,
    loading: invoiceLoading,
  } = useSelector((state) => state.events);

  const dispatch = useDispatch();

  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [showPhoneInputModal, setShowPhoneInputModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  if (!event) {
    return (
      <View style={styles.container}>
        <Text value="Event not found" variant="body" />
      </View>
    );
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // console.log("Focused Event:", route.params?.event);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(checkUserAuthentication());
  }, []);

  useEffect(() => {
    if (invoiceError) {
      Alert.alert("Error", invoiceError.message);
      dispatch(clearInvoiceError());
    }
  }, [invoiceError]);

  useEffect(() => {
    return () => {
      dispatch(clearPaymentData());
    };
  }, []);

  useEffect(() => {
    if (invoice && invoice.id) {
      setShowInvoiceModal(true);
    }
  }, [invoice]);

  const togglePhoneInputModal = () =>
    setShowPhoneInputModal(!showPhoneInputModal);
  const toggleInvoiceModal = () => setShowInvoiceModal(!showInvoiceModal);

  const handleSelectTicketQuantity = (quantity, ticket) => {
    setTicketQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities, [ticket.id]: quantity };
      const newAttendees = [];

      Object.keys(updatedQuantities).forEach((ticketId) => {
        const qty = updatedQuantities[ticketId];
        if (qty > 0) {
          const ticket = event.ticket_types.find(
            (t) => t.id === parseInt(ticketId, 10)
          );
          for (let i = 0; i < qty; i++) {
            newAttendees.push({
              ticket_name: ticket.title,
              event_name: event.title,
              first_name: user?.first_name || "",
              last_name: user?.last_name || "",
              phone: formatPhoneNumberToMpesaFormat(
                user?.phone || phoneInput || ""
              ),
              event_id: event.id,
              email: user?.email || "",
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

  const transformAttendeeInfo = (dataObject) => {
    const transformedAttendeeInfo = dataObject.data.attendeeInfo.flatMap(
      (attendee) => Array(attendee.quantity).fill({ ...attendee, quantity: 1 })
    );

    return { ...dataObject, data: { attendeeInfo: transformedAttendeeInfo } };
  };

  const handleBuyTicket = () => {
    if (attendeeInfo.length === 0) {
      alert("Please select at least one ticket");
      return;
    }

    // if (!isAuthenticated) {
    //   alert("Please login to buy a ticket");
    //   navigation.navigate("ClubNavigator", { screen: "Login" });
    //   return;
    // }

    // if (isAuthenticated && phoneInput === "") {
    //   setShowPhoneInputModal(true);
    //   return;
    // }
    if (phoneInput === "") {
      setShowPhoneInputModal(true);
      return;
    }

    const requiredFields = ["first_name", "last_name", "phone", "email"];
    const missingFields = attendeeInfo.filter((attendee) =>
      requiredFields.some((field) => !attendee[field])
    );

    if (missingFields.length > 0) {
      alert("Please fill all required fields");
      return;
    }

    const invoiceData = { data: { attendeeInfo }, source_application: 2 };
    const transformedDataObject = transformAttendeeInfo(invoiceData);

    dispatch(createInvoice(transformedDataObject));

    setTicketQuantities({});
    setAttendeeInfo([]);
  };

  const handlePhoneUpdate = () => {
    if (phoneInput && phoneInput !== "") {
      const formattedPhone = formatPhoneNumberToMpesaFormat(phoneInput);
      setAttendeeInfo((prevInfo) =>
        prevInfo.map((attendee) => ({ ...attendee, phone: formattedPhone }))
      );
      setShowPhoneInputModal(false);
    } else {
      alert("please enter your phone number");
    }
  };

  if (invoiceLoading) {
    return (
      <View
        style={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating={true} color="black" />
      </View>
    );
  }

  // console.log(event.ticket_types);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          data={[event]} // Wrap the event in an array for FlatList rendering
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <View style={styles.row}>
                <Image source={{ uri: item.banner }} style={styles.banner} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text value={item.title} variant="subtitle" />
                  <Text
                    value={`${formatEventDates(
                      item.start_date,
                      item.end_date
                    )}`}
                    variant="body"
                    style={{ marginVertical: 3 }}
                  />
                  <Text
                    value={`${getTime(item.start_date) || "TBD"} to ${
                      getTime(item.end_date) || "TBD"
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
                    <Text value={item.location} variant="body" />
                  </View>
                  {item?.description ? (
                    <WebView
                      originWhitelist={["*"]}
                      source={{
                        html: `<html><body style="font-size:50px; font-family:Montserrat;">${item.description}</body></html>`,
                      }}
                    />
                  ) : (
                    <Text value="No description available" variant="body" />
                  )}
                </View>
              </View>

              <View style={styles.detailsContainer}>
                {item.ticket_types && item.ticket_types.length > 0 ? (
                  <FlatList
                    data={item.ticket_types.filter(
                      (item) =>
                        item.is_active &&
                        item.id !== 22 &&
                        item.is_rahaclub_vip === showDiscount
                    )}
                    keyExtractor={(ticket) => ticket.id.toString()}
                    renderItem={({ item: ticket }) => (
                      <TicketCard
                        key={ticket.id.toString()}
                        item={ticket}
                        handleSelectTicketQuantity={handleSelectTicketQuantity}
                      />
                    )}
                  />
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

              {isAuthenticated && (
                <UserInfoCard
                  loading={loading}
                  user={user}
                  phone={phoneInput}
                />
              )}

              <View>
                <Button
                  disabled={item.location === "TBA"}
                  label="Buy Ticket"
                  variant={"contained"}
                  onPress={handleBuyTicket}
                />
              </View>

              <ModalComponent
                visible={showPhoneInputModal}
                toggleModal={togglePhoneInputModal}
                transparent={false}
              >
                <PhoneInput
                  value={phoneInput}
                  setPhoneInput={setPhoneInput}
                  handlePhoneUpdate={handlePhoneUpdate}
                />
              </ModalComponent>

              {invoice && invoice.id && (
                <ModalComponent
                  visible={showInvoiceModal}
                  toggleModal={toggleInvoiceModal}
                  transparent={false}
                >
                  <PaymentModal
                    navigation={navigation}
                    invoice={invoice}
                    toggleModal={toggleInvoiceModal}
                  />
                </ModalComponent>
              )}
            </>
          )}
        />
      </KeyboardAvoidingView>
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
