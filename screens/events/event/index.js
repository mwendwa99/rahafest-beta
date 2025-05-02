import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  Linking,
  useWindowDimensions,
} from "react-native";
import api from "../../../services/api.service"; // Assuming you have api.service.js
import TicketSelection from "./TicketSelection"; // Assuming you have TicketSelection.js
// import { parse } from 'html-react-parser'; // If you need HTML parsing, consider react-native-render-html, or simplify description to plain text
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { formatDate, stripHtmlTags } from "../../../utils/helper";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");
const isMobile = width < 768; // Simple mobile check - adjust as needed

const EventScreen = ({ navigation }) => {
  // route prop if using navigation
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicketsDetails, setSelectedTicketsDetails] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Using Alert instead of Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Not used with Alert
  const [filteredTickets, setFilteredTickets] = useState([]); // State to hold filtered tickets
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 700;

  const route = useRoute();
  const searchTitle = route.params.params?.title;

  // Simulate searchParams.get("search") using route params if needed
  //   const searchTitle = route?.params?.search || "your_event_title"; // Or get from props, context etc.

  const fetchEvent = useCallback(async () => {
    if (!searchTitle) {
      setError("No event specified");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Adapt api.get for React Native - assuming api.service.js is adjusted or using fetch
      const response = await api.get(
        `/public/events/list?search=${encodeURIComponent(searchTitle)}`
      );

      if (response.data.data.items.length === 0) {
        setError("Event not found");
        return;
      }
      setEvent(response.data.data.items[0]);
    } catch (err) {
      setError(err.message || "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  }, [searchTitle]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    if (event) {
      // Document title/meta tags are less relevant in React Native.
      // You might set screen title in navigation options if using React Navigation.
      // Example: navigation.setOptions({ title: event.title });

      // Filter tickets based on criteria
      const activeTickets = event.ticket_types.filter((ticket) => {
        return (
          ticket.is_active === true &&
          ticket.is_rahaclub_vip === false &&
          ticket.show_on_mobile_app === true
        );
      });
      setFilteredTickets(activeTickets); // Set the filtered tickets
    }
  }, [event]);

  const handleTicketDetailsChange = useCallback(
    (ticketTypeId, quantity, userDetails) => {
      setSelectedTicketsDetails((prev) => ({
        ...prev,
        [ticketTypeId]: { quantity, userDetails },
      }));
    },
    []
  );

  const handleCreateInvoice = async () => {
    if (!event) return;

    const ticketsPayload = [];
    let invoiceAmount = 0;
    let ticketQuantity = 0;
    const selectedTickets = [];

    for (const [ticketTypeId, ticketInfo] of Object.entries(
      selectedTicketsDetails
    )) {
      if (ticketInfo.quantity > 0) {
        const ticketType = event.ticket_types.find(
          (t) => t.id === parseInt(ticketTypeId)
        );

        if (ticketType) {
          invoiceAmount += ticketInfo.quantity * parseFloat(ticketType.price);
          ticketQuantity += ticketInfo.quantity;

          selectedTickets.push({
            id: ticketType.id,
            title: ticketType.title,
            price: ticketType.price,
            quantity: ticketInfo.quantity,
          });

          for (const userDetail of ticketInfo.userDetails) {
            if (
              !userDetail?.first_name ||
              !userDetail?.last_name ||
              !userDetail?.email ||
              !userDetail?.phone
            ) {
              Alert.alert("Error", "Please fill in details for all tickets.");
              return;
            }

            ticketsPayload.push({
              ticket_type_id: parseInt(ticketTypeId),
              event_id: event.id,
              ...userDetail,
            });
          }
        }
      }
    }

    if (ticketsPayload.length === 0) {
      Alert.alert("Error", "Please select tickets to purchase.");
      return;
    }

    try {
      setLoading(true);

      const createInvoiceData = {
        tickets: ticketsPayload,
        event_id: event.id,
        invoice_amount: invoiceAmount.toFixed(2),
        ticket_quantity: ticketQuantity,
        event_organizer_id: event.event_organizer.id,
        source_application: 1,
      };

      // Assuming api.post is adapted for React Native
      const response = await api.post("/invoices/create", createInvoiceData);

      const checkoutData = {
        invoice: response.data.data,
        selectedTickets,
        event: {
          title: event.title,
          venue: event.venue,
          start_date: event.start_date,
          end_date: event.end_date,
          event_organizer: event.event_organizer,
        },
      };

      navigation.navigate("Checkout", { checkoutData });

      //  pass data via navigation to checkout
      // For simplicity, just alert success here.
      //   Alert.alert(
      //     "Success",
      //     `${JSON.stringify(response.data.data)} - Invoice created successfully`
      //   );
    } catch (error) {
      Alert.alert("Error", `Failed to create invoice: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B41818" />
        <Text style={{ marginTop: 10, color: "gray" }}>Loading event...</Text>
        {/* Basic Skeleton placeholders - can be enhanced with animated placeholders */}
        <View style={{ marginTop: 20, width: "90%", maxWidth: 600 }}>
          <View
            style={{
              height: 200,
              backgroundColor: "#f0f0f0",
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
          <View
            style={{
              height: 40,
              backgroundColor: "#f0f0f0",
              marginBottom: 10,
              borderRadius: 4,
              width: "80%",
            }}
          />
          <View
            style={{
              height: 30,
              backgroundColor: "#f0f0f0",
              marginBottom: 10,
              borderRadius: 4,
              width: "60%",
            }}
          />
          <View
            style={{
              height: 150,
              backgroundColor: "#f0f0f0",
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Event not found"}</Text>

        <TouchableOpacity
          onPress={() => {
            /* Navigate back logic */
          }}
        >
          <Text style={{ color: "#B41818" }}>
            Return to Events (Placeholder)
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {event.wide_banner && (
          <Image
            source={{
              uri: event.wide_banner,
            }}
            style={styles.eventImage}
          />
        )}

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.organizerName}>
          {event.event_organizer.organization_name}
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            {/* Replace with actual icons or simple Text equivalents */}
            {/* <CalendarTodayIcon style={styles.infoIcon} /> */}
            <Text style={styles.infoIcon}>🗓️</Text>
            <Text style={styles.infoText}>{formatDate(event.start_date)}</Text>
          </View>
          <View style={styles.infoItem}>
            {/* <LocationOnOutlinedIcon style={styles.infoIcon} /> */}
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{event.venue}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionText}>
          {/* {event.description}{" "} */}
          {event?.description ? stripHtmlTags(event.description) : ""}
        </Text>

        <View style={styles.tagsContainer}>
          {event.tags.map((tag) => (
            <View key={tag.id} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag.tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.socialLinksContainer}>
          {event.instagram_url && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(event.instagram_url)}
            >
              <Text style={styles.infoIcon}>📸</Text>
              <Text style={styles.socialButtonText}>Instagram</Text>
            </TouchableOpacity>
          )}
          {event.x_url && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(event.x_url)}
            >
              <Text style={styles.infoIcon}>🐦</Text>
              <Text style={styles.socialButtonText}>Twitter</Text>
            </TouchableOpacity>
          )}
          {event.meta_url && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL(event.meta_url)}
            >
              <Text style={styles.infoIcon}>
                {/* Facebook Icon Placeholder */} f{" "}
              </Text>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          )}
        </View>

        {filteredTickets.length > 0 && ( // Use filteredTickets here
          <View style={styles.ticketsSection}>
            <Text style={styles.ticketsTitle}>Available Tickets</Text>
            {filteredTickets.map(
              (
                ticket,
                index // Map over filteredTickets
              ) => (
                <TicketSelection
                  key={ticket.id}
                  ticket={ticket}
                  onTicketDetailsChange={handleTicketDetailsChange}
                  index={index}
                />
              )
            )}
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleCreateInvoice}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    // paddingVertical: isMobile ? 16 : 40,
    // backgroundColor: "#fff", // Assuming white background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  eventImage: {
    width: "100%",
    height: isMobile ? 100 : 250, // Adjust image height for mobile/web
    borderRadius: 8, // Similar to borderRadius on web Paper
    marginBottom: 20,
    resizeMode: isMobile ? "cover" : "cover", // Adjust resizeMode for mobile/web
  },
  eventTitle: {
    fontSize: isMobile ? 24 : 30, // Adjust font size for mobile/web
    fontWeight: "bold",
    marginBottom: 8,
  },
  organizerName: {
    fontSize: 16,
    color: "gray", // text.secondary from MUI
    marginBottom: 16,
  },
  infoBox: {
    // marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    color: "#B41818", // Primary color equivalent
    fontSize: 20, // Adjust icon size if needed
  },
  infoText: {
    fontSize: 16,
  },
  divider: {
    borderBottomColor: "lightgray", // Divider color
    borderBottomWidth: 1,
    marginVertical: 24,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24, // Adjust line height for readability
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: "#e0e0e0", // Chip background color - light grey
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, // Chip border radius
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "black", // Adjust tag text color if needed
  },
  socialLinksContainer: {
    marginBottom: 16,
    flexDirection: "row",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 8,
    borderColor: "#B41818", // Primary color for border
    borderWidth: 1,
  },
  socialButtonText: {
    marginLeft: 4,
    color: "black", // Adjust social button text color
  },
  ticketsSection: {
    padding: 16,
    borderRadius: 4, // Paper equivalent border radius
    marginBottom: 20,
    backgroundColor: "#f9f9f9", // Light grey background for ticket section
    elevation: 2, // Basic elevation for shadow (Android) - for iOS, use shadow props
    shadowColor: "#000", // iOS shadow properties if needed
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ticketsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#B41818", // Primary color
  },
  proceedButton: {
    backgroundColor: "#B41818", // Primary color for button
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  proceedButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  floorPlanSection: {
    padding: 16,
    borderRadius: 4,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  floorPlanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  floorPlanImage: {
    width: "100%",
    height: 300, // Adjust floor plan image height
    resizeMode: "contain",
  },
  // Add styles for icons as needed, e.g., using react-native-vector-icons or simple Text
  icon: {
    fontSize: 20, // Example icon style - adjust as needed
    color: "#B41818",
  },
});
