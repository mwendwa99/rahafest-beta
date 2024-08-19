import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, FlatList, Alert } from "react-native";
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
  UserInputForm,
  ModalComponent,
  PhoneInput,
} from "../../../components";

import {
  formatEventDates,
  formatPhoneNumberToMpesaFormat,
} from "../../../utils/helper";
import { checkUserAuthentication } from "../../../redux/auth/authSlice";
import { createInvoice } from "../../../redux/events/eventActions";
import { clearInvoiceError } from "../../../redux/events/eventSlice";

export default function Checkout({ route }) {
  const { event } = route.params || {};
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const {
    invoice,
    invoiceError,
    loading: invoiceLoading,
  } = useSelector((state) => state.events);

  const dispatch = useDispatch();

  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [showUserInputModal, setShowUserInputModal] = useState(false);
  const [showPhoneInputModal, setShowPhoneInputModal] = useState(false);
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

  const toggleUserInputModal = () => setShowUserInputModal(!showUserInputModal);

  const togglePhoneInputModal = () =>
    setShowPhoneInputModal(!showPhoneInputModal);

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

  const handleBuyTicket = () => {
    if (attendeeInfo.length === 0) {
      alert("Please select at least one ticket");
      return;
    }

    if (!isAuthenticated) {
      setShowUserInputModal(true);
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

    const invoiceData = { data: { attendeeInfo } };

    // console.log(invoiceData);

    dispatch(createInvoice(invoiceData));
  };

  const handlePhoneUpdate = () => {
    const formattedPhone = formatPhoneNumberToMpesaFormat(phoneInput);
    setAttendeeInfo((prevInfo) =>
      prevInfo.map((attendee) => ({ ...attendee, phone: formattedPhone }))
    );
    setShowPhoneInputModal(false);
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

  console.log("invoice", invoice);
  console.log("invoiceError", invoiceError);

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
      {isAuthenticated && (
        <UserInfoCard loading={loading} user={user} phone={phoneInput} />
      )}

      <View>
        <Button
          label="Buy Ticket"
          variant={"contained"}
          onPress={handleBuyTicket}
        />
      </View>

      {/* User Input Modal */}
      <ModalComponent
        visible={showUserInputModal}
        toggleModal={toggleUserInputModal}
        transparent={false}
      >
        <UserInputForm onClose={() => setShowUserInputModal(false)} />
      </ModalComponent>

      {/* Phone Input Modal */}
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
