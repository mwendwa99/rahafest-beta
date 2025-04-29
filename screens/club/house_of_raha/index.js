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
import api from "../../../services/club.api.service"; // Assuming this path is correct

export default function HouseOfRaha() {
  const [open, setOpen] = useState(false);
  // Initialize eventType to null so the placeholder is visible initially
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
          // Do NOT automatically set eventType here.
          // The user should select it from the dropdown.
        }
      } catch (error) {
        console.error("Error fetching booking types:", error);
        Alert.alert(
          "Error",
          "Failed to fetch booking types. Please try again later."
        );
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
        "We need permission to access your photos to upload an event poster."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Standard aspect ratio for posters
      quality: 0.8, // Slightly lower quality for faster upload
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
      Alert.alert("Validation Error", "Please select an event type.");
      return;
    }
    if (!guests || parseInt(guests) <= 0) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid number of expected guests."
      );
      return;
    }
    if (!date) {
      Alert.alert(
        "Validation Error",
        "Please select a date and time for the event."
      );
      return;
    }

    try {
      // Create FormData object for multipart form data
      const formData = new FormData();
      formData.append("booking_type_id", eventType);
      formData.append("start_time", date.toISOString());
      formData.append(
        "end_time",
        new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString()
      );
      formData.append("number_of_guests", parseInt(guests));
      formData.append("special_requests", setup || "");

      // Add poster image if available
      if (poster) {
        // Extract file name and type from URI
        const uriParts = poster.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("poster_image", {
          uri: poster,
          name: `poster.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      // Make API request with FormData
      const response = await api.post(
        "/house-of-raha/bookings/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      Alert.alert(
        "Success",
        "Your event details have been submitted successfully!"
      );

      // Clear the form
      setEventType(null);
      setDate(new Date());
      setGuests("");
      setSetup("");
      setPoster(null);
    } catch (error) {
      console.error(
        "Error submitting booking:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Submission Failed",
        error.response?.data?.message ||
          "An error occurred while submitting your event details. Please try again."
      );
    }
  };

  // Render form content as a single item for FlatList
  const renderFormContent = () => (
    <View style={styles.formContainer}>
      {/* Logo */}
      <Image
        source={require("../../../assets/houseofraha.png")} // Ensure this path is correct
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Make your event unforgettable</Text>

      {/* Event Type Dropdown */}
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          style={styles.dropdown}
          placeholder="Select Event Type" // This is the default text
          open={open}
          value={eventType} // Should be null initially
          items={bookingTypes}
          setOpen={setOpen}
          setValue={setEventType}
          setItems={setBookingTypes}
          zIndex={3000} // Ensure dropdown is above other elements
          zIndexInverse={1000}
          listMode="SCROLLVIEW" // Use SCROLLVIEW for better integration in FlatList
          dropDownContainerStyle={styles.dropdownList}
          // Add styling props here
          textStyle={styles.dropdownText}
          placeholderStyle={styles.dropdownPlaceholder}
          // labelStyle={styles.dropdownLabel} // Style for selected item
        />
      </View>

      {/* Date Picker Button */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Icon name="calendar-outline" size={20} color="#666" />
        <Text style={styles.dateButtonText}>
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
        minimumDate={new Date()} // Prevent selecting past dates
      />

      {/* Guest Input */}
      <TextInput
        style={styles.input}
        placeholder="Number of Guests"
        placeholderTextColor="#999"
        value={guests}
        onChangeText={setGuests}
        keyboardType="number-pad" // number-pad is better for pure numbers
        returnKeyType="next"
      />

      {/* Setup Requirements Input */}
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Setup Requirements (Optional)"
        placeholderTextColor="#999"
        value={setup}
        onChangeText={setSetup}
        multiline
        numberOfLines={4} // Give a bit more space
        textAlignVertical="top" // Align text to the top
        returnKeyType="default" // No specific action
      />

      {/* Image Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Icon name="image-outline" size={20} color="#666" />
        <Text style={styles.uploadButtonText}>
          Upload Event Poster (Optional)
        </Text>
        {poster && (
          <Icon
            name="checkmark-circle-outline"
            size={20}
            color="green"
            style={{ marginLeft: 10 }}
          />
        )}
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
      // behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' is usually better for iOS
      behavior="padding" // Use padding for both platforms, adjust offset if needed
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust offset based on header height etc.
      enabled
    >
      {/* Using FlatList for scrollable form */}
      <FlatList
        data={[{ key: "form" }]}
        renderItem={renderFormContent}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // Better keyboard dismissal
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light grey background
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Ensure space below the form
  },
  formContainer: {
    // backgroundColor: "#fff", // White background for the form area
    // borderRadius: 8,
    padding: 20,
    // shadowColor: "#000", // Add subtle shadow
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3, // Android shadow
  },
  logo: {
    width: "80%", // Make logo slightly smaller
    height: 100,
    resizeMode: "contain",
    alignSelf: "center", // Center the logo
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 15, // Slightly larger title
    fontWeight: "bold",
    color: "#333",
    textAlign: "center", // Center the title
    marginBottom: 20,
  },
  dropdownContainer: {
    // Necessary wrapper for DropDownPicker to control zIndex
    marginBottom: 15,
    zIndex: 3000, // Higher zIndex for dropdown
  },
  dropdown: {
    borderColor: "#ccc", // Lighter border color
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 15, // Add padding
  },
  dropdownList: {
    borderColor: "#ccc", // Border for the dropdown list
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#999", // Placeholder text color
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16, // Consistent font size
    color: "#333",
  },
  multilineInput: {
    minHeight: 100, // Use minHeight instead of height
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    flex: 1, // Allows text to take up space and push icon to the right
  },
  posterPreview: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#007BFF", // A standard blue color
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10, // Add some space above button
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18, // Larger text for button
  },
});
