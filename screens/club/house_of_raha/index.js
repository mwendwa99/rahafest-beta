import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons as Icon } from "@expo/vector-icons";
import api from "../../../services/club.api.service";

export default function HouseOfRaha() {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [guests, setGuests] = useState("");
  const [setup, setSetup] = useState("");
  const [poster, setPoster] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookingTypes, setBookingTypes] = useState([]);

  // fetch booking types from /house-of-raha/bookingstypes
  useEffect(() => {
    const fetchBookingTypes = async () => {
      try {
        const response = await api.get("house-of-raha/bookingstypes");
        if (response.data && response.data.data) {
          const types = response.data.data.map((type) => ({
            label: type.name,
            value: type.id,
          }));
          setBookingTypes(types);
          if (types.length > 0) {
            setEventType(types[0].value);
          }
        }
      } catch (error) {
        console.error("Error fetching booking types:", error);
        Alert.alert("Error", "Failed to fetch booking types");
      }
    };
    fetchBookingTypes();
  }, []);

  // Function to pick an image from gallery
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need permission to access your photos"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // For Expo SDK 47 and later, the selected assets are in the 'assets' array
      if (result.assets && result.assets.length > 0) {
        setPoster(result.assets[0].uri);
      } else if (result.uri) {
        // Fallback for older Expo SDK versions
        setPoster(result.uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!eventType) {
      Alert.alert("Error", "Please select an event type");
      return;
    }
    if (!guests) {
      Alert.alert("Error", "Please enter the number of expected guests");
      return;
    }
    if (!date) {
      Alert.alert("Error", "Please select a date and time");
      return;
    }

    const payload = {
      booking_type_id: eventType,
      start_time: date.toISOString(),
      end_time: new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
      number_of_guests: parseInt(guests),
      special_requests: setup || "", // optional field
    };

    try {
      const response = await api.post("/house-of-raha/bookings", payload);
      console.log("Booking created:", response.data);
      Alert.alert("Success", "Event details submitted successfully");
    } catch (error) {
      console.error("Error submitting booking:", JSON.stringify(error));
      Alert.alert("Error", "Failed to submit booking");
    }
  };

  // Render form content as a single item for FlatList
  const renderFormContent = () => (
    <View style={styles.formContainer}>
      <Image
        source={require("../../../assets/houseofraha.png")}
        style={styles.image}
      />

      {/* Event Type Dropdown - Only show when dropdown is closed */}
      {!open && (
        <TouchableOpacity style={styles.input} onPress={() => setOpen(true)}>
          <Text style={eventType ? styles.inputText : styles.placeholderText}>
            {eventType
              ? bookingTypes.find((item) => item.value === eventType)?.label
              : "Select Event Type"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Dropdown displayed when opened */}
      {open && (
        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            style={styles.dropdown}
            placeholder="Select Event Type"
            open={open}
            value={eventType}
            items={bookingTypes}
            setOpen={setOpen}
            setValue={setEventType}
            setItems={setBookingTypes}
            zIndex={3000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              keyboardShouldPersistTaps: "always",
              contentContainerStyle: { paddingBottom: 20 },
            }}
          />
        </View>
      )}

      {/* Date Picker Button */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Icon name="calendar" size={24} color="#666" />
        <Text style={styles.dateText}>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        date={date}
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          setDate(selectedDate);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* Guest Input */}
      <TextInput
        style={styles.input}
        placeholder="Expected Guests"
        value={guests}
        onChangeText={setGuests}
        keyboardType="numeric"
        returnKeyType="next"
        blurOnSubmit={false}
      />

      {/* Setup Requirements Input */}
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Setup Requirements (Optional)"
        value={setup}
        onChangeText={setSetup}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Image Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Icon name="cloud-upload-outline" size={24} color="#666" />
        <Text style={styles.uploadText}>Upload Event Poster (Optional)</Text>
      </TouchableOpacity>

      {/* Image Preview */}
      {poster && (
        <Image
          source={{ uri: poster }}
          style={styles.posterPreview}
          resizeMode="cover"
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Event Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 30}
      enabled
    >
      {/* Using FlatList instead of ScrollView to avoid nesting issues */}
      <FlatList
        data={[{ key: "form" }]}
        renderItem={() => renderFormContent()}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        removeClippedSubviews={false}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding at the bottom for better scrolling
  },
  formContainer: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 15,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputText: {
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  uploadText: {
    marginLeft: 10,
    color: "#333",
  },
  posterPreview: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
