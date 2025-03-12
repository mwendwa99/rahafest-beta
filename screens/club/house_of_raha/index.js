import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons as Icon } from "@expo/vector-icons";

export default function HouseOfRaha() {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [guests, setGuests] = useState("");
  const [setup, setSetup] = useState("");
  const [poster, setPoster] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleSubmit = () => {
    // Check required fields
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

    // Console log the data
    console.log({
      eventType,
      date,
      guests: parseInt(guests),
      setup,
      poster,
    });

    // You can add your form submission logic here
    Alert.alert("Success", "Event details submitted successfully");
  };

  // Form content as a separate component to be rendered inside FlatList
  const FormContent = () => (
    <>
      <Image
        source={require("../../../assets/houseofraha.png")}
        style={styles.image}
      />

      <View style={styles.formContainer}>
        <DropDownPicker
          style={styles.dropdown}
          placeholder="Select Event Type"
          open={open}
          value={eventType}
          items={[
            { label: "House Party", value: "houseParty" },
            { label: "Birthday Party", value: "birthdayParty" },
            { label: "Listening Party", value: "listeningParty" },
            { label: "Live Deejay Mix", value: "liveDeejay" },
            { label: "Interviews", value: "interviews" },
          ]}
          setOpen={setOpen}
          setValue={setEventType}
          // Set zIndex to ensure dropdown appears above other elements
          zIndex={3000}
          zIndexInverse={1000}
        />

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

        <TextInput
          style={styles.input}
          placeholder="Expected Guests"
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Setup Requirements (Optional)"
          value={setup}
          onChangeText={setSetup}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Icon name="cloud-upload-outline" size={24} color="#666" />
          <Text style={styles.uploadText}>Upload Event Poster (Optional)</Text>
        </TouchableOpacity>

        {poster && (
          <Image
            source={{ uri: poster }}
            style={styles.posterPreview}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Event Details</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {/* Replace ScrollView with FlatList to fix the nesting VirtualizedLists error */}
      <FlatList
        data={[{ key: "formContent" }]}
        renderItem={() => <FormContent />}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
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
    paddingBottom: 40, // Extra padding at the bottom for better scrolling
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  dropdown: {
    marginBottom: 15,
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
