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
  // UserInputForm,
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

export default function Checkout({ route, navigation }) {
  const { event } = route.params || {};
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const {
    invoice,
    invoiceError,
    loading: invoiceLoading,
  } = useSelector((state) => state.events);

  const dispatch = useDispatch();

  // console.log(user);

  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  // const [showUserInputModal, setShowUserInputModal] = useState(false);
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

  //once the invoice has been created, show the payment modal
  useEffect(() => {
    if (invoice && invoice.id) {
      setShowInvoiceModal(true);
    }
  }, [invoice]);

  // const toggleUserInputModal = () => setShowUserInputModal(!showUserInputModal);

  const togglePhoneInputModal = () => {
    setShowPhoneInputModal(!showPhoneInputModal);
  };

  const toggleInvoiceModal = () => {
    setShowInvoiceModal(!showInvoiceModal);
  };

  const handleSelectTicketQuantity = (quantity, ticket) => {
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

  function transformAttendeeInfo(dataObject) {
    const transformedAttendeeInfo = dataObject.data.attendeeInfo.flatMap(
      (attendee) => Array(attendee.quantity).fill({ ...attendee, quantity: 1 })
    );

    return { ...dataObject, data: { attendeeInfo: transformedAttendeeInfo } };
  }

  const handleBuyTicket = () => {
    if (attendeeInfo.length === 0) {
      alert("Please select at least one ticket");
      return;
    }

    if (!isAuthenticated) {
      alert("Please login to buy a ticket");
      navigation.navigate("ClubNavigator", {
        screen: "Login",
      });
      return;
    }

    if (isAuthenticated && phoneInput === "") {
      setShowPhoneInputModal(true);
      return;
    }

    //validate that all required fields are filled
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

    // console.log(transformedDataObject);
    dispatch(createInvoice(transformedDataObject));

    // console.log(invoiceData);

    // dispatch(createInvoice(invoiceData));

    //reset all state
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
  // console.log({ data: { attendeeInfo } });

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
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset for iOS devices
        style={{ flex: 1 }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.row}>
            <Image source={{ uri: event.banner }} style={styles.banner} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text value={event.title} variant="subtitle" />
              <Text
                // value={formatEventDates(event.start_date, event.end_date)}
                value={`${getTime(event.start_date) || "TBD"} to ${
                  getTime(event.end_date) || "TBD"
                }`}
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
            {(event.ticketTypes && event.ticketTypes.length > 0) ||
            event.location !== "TBA" ? (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{ maxHeight: 300 }}
              >
                {event.ticketTypes.map((item) => (
                  <TicketCard
                    key={item.id.toString()}
                    item={item}
                    handleSelectTicketQuantity={handleSelectTicketQuantity}
                  />
                ))}
              </ScrollView>
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
            <UserInfoCard loading={loading} user={user} phone={phoneInput} />
          )}

          <View>
            <Button
              disabled={event.location === "TBA"}
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
                invoice={invoice}
                toggleModal={toggleInvoiceModal}
              />
            </ModalComponent>
          )}
        </ScrollView>
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
    objectFit: "cover",
  },
});
