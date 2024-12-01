//@ts-nocheck
import { createInvoice } from "@/store/app/appActions";
import { formatCurrency } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const EventRegistrationForm = () => {
  const params = useLocalSearchParams();
  const { eventId, tickets } = params;
  const router = useRouter();

  const dispatch = useDispatch();
  const { invoice } = useSelector((state) => state.app);
  const [loading, setLoading] = useState(false); // Track loading state

  // Parse the tickets data
  const selectedTickets = JSON.parse(tickets as string);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      tempErrors.email = "Please enter a valid email";
    }

    if (!formData.first_name.trim()) {
      tempErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      tempErrors.last_name = "Last name is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true); // Start loading before dispatch
      const attendeeInfo = selectedTickets.flatMap((ticket) => {
        return Array(ticket.quantity).fill({
          event: parseInt(eventId),
          ticket_type: parseInt(ticket.ticketId),
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone, // Use the updated phone number
          amount_paid: parseFloat(ticket.price),
          RF_id: null,
        });
      });

      const processedData = {
        data: {
          attendeeInfo,
        },
      };

      await dispatch(createInvoice(processedData));
      setLoading(false); // End loading after dispatch is complete
    } else {
      alert("Form Error", "Please check all fields and try again");
    }
  };

  // UseEffect to format the phone number
  useEffect(() => {
    if (formData.phone) {
      let phone = formData.phone;

      if (phone.startsWith("01")) {
        phone = "2541" + phone.slice(2); // Replace '01' with '2541'
      } else if (phone.startsWith("07")) {
        phone = "2547" + phone.slice(2); // Replace '07' with '2547'
      }

      // Update phone number if it's changed
      if (phone !== formData.phone) {
        setFormData((prevData) => ({ ...prevData, phone }));
      }
    }
  }, [formData.phone]);

  // UseEffect to navigate to checkout page if invoice exists and is valid
  useEffect(() => {
    if (invoice && Object.keys(invoice).length > 0) {
      // Ensure the invoice has valid data before navigating
      if (invoice.invoice_number) {
        router.push("/events/checkout");
      }
    }
  }, [invoice, router]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const renderInput = (
    label,
    key,
    keyboardType = "default",
    placeholder = ""
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(text) => setFormData({ ...formData, [key]: text })}
        keyboardType={keyboardType}
        placeholder={placeholder}
        returnKeyType="done"
        onSubmitEditing={dismissKeyboard}
        placeholderTextColor={"#c3c3c3"}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  // Calculate total tickets
  const totalTickets = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>
        Registering {totalTickets} ticket{totalTickets > 1 ? "s" : ""}
      </Text>

      {/* Ticket Summary */}
      <View style={styles.summaryContainer}>
        {selectedTickets.map((ticket, index) => (
          <Text key={index} style={styles.summaryText}>
            {ticket.quantity}x Ticket (at KES. {formatCurrency(ticket.price)}{" "}
            each)
          </Text>
        ))}
      </View>

      {renderInput("Email", "email", "email-address", "Enter your email")}
      {renderInput(
        "First Name",
        "first_name",
        "default",
        "Enter your first name"
      )}
      {renderInput("Last Name", "last_name", "default", "Enter your last name")}
      {renderInput("Phone", "phone", "phone-pad", "Enter your phone number")}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  subtitle: {
    color: "#c3c3c3",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#c3c3c3",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#FE1648",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#c3c3c3",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});

export default EventRegistrationForm;
