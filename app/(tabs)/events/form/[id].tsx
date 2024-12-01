//@ts-nocheck
import { formatCurrency } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";

const EventRegistrationForm = () => {
  const params = useLocalSearchParams();
  const { eventId, tickets } = params;
  const router = useRouter();

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

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      tempErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create attendeeInfo array for all tickets
      const attendeeInfo = selectedTickets.flatMap((ticket) => {
        return Array(ticket.quantity).fill({
          event: parseInt(eventId),
          ticket_type: parseInt(ticket.ticketId),
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          amount_paid: parseFloat(ticket.price),
          RF_id: null,
        });
      });

      const processedData = {
        attendeeInfo,
      };

      console.dir(processedData);
      // Here you would make your API call with the processedData
    } else {
      alert("Form Error", "Please check all fields and try again");
    }
  };
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
      <Text style={styles.title}>User Info</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#FE1648",
    padding: 15,
    borderRadius: 5,
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
    backgroundColor: "#f5f5f5",
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
