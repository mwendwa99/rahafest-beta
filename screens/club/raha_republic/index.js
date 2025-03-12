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
  FlatList, // Changed from ScrollView to FlatList
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons as Icon } from "@expo/vector-icons";

export default function RahaRepublic() {
  const [open, setOpen] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [requirements, setRequirements] = useState("");
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to pick documents/files
  const pickFiles = async () => {
    try {
      // Request permission (for iOS)
      if (Platform.OS === "ios") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "We need permission to access your files"
          );
          return;
        }
      }

      // Launch document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow any file type
        multiple: true, // Allow multiple file selection
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        // Add the new files to existing reference files
        setReferenceFiles((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.log("Error picking files:", error);
      Alert.alert("Error", "Could not pick files. Please try again.");
    }
  };

  // Function to remove a file from the list
  const removeFile = (index) => {
    setReferenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Check required fields
    if (!serviceType) {
      Alert.alert("Error", "Please select a service type");
      return;
    }
    if (!date) {
      Alert.alert("Error", "Please select a date and time");
      return;
    }
    if (!duration) {
      Alert.alert("Error", "Please enter the session duration");
      return;
    }

    // Console log the data
    console.log({
      serviceType,
      date,
      duration: parseInt(duration),
      requirements,
      referenceFiles,
    });

    // You can add your form submission logic here
    Alert.alert("Success", "Booking details submitted successfully");
  };

  // Data for the FlatList
  const formItems = [
    { key: "image" },
    { key: "sectionTitle" },
    { key: "dropdown" },
    { key: "dateButton" },
    { key: "durationContainer" },
    { key: "requirementsInput" },
    { key: "uploadButton" },
    { key: "fileList" },
    { key: "submitButton" },
  ];

  // Render each item based on its key
  const renderItem = ({ item }) => {
    switch (item.key) {
      case "image":
        return (
          <Image
            source={require("../../../assets/raharepublic.png")}
            style={styles.image}
          />
        );
      case "sectionTitle":
        return <Text style={styles.sectionTitle}>Book a Session</Text>;
      case "dropdown":
        return (
          <DropDownPicker
            style={styles.dropdown}
            placeholder="Select Service Type"
            open={open}
            value={serviceType}
            items={[
              { label: "Music Studio", value: "musicStudio" },
              { label: "Live Audio Recording", value: "liveAudioRecording" },
              { label: "Podcast Recording", value: "podcastRecording" },
              { label: "Voice-over Recording", value: "voiceoverRecording" },
              { label: "Video Recording", value: "videoRecording" },
              { label: "Post Production Editing", value: "postProduction" },
              { label: "Rehearsals", value: "rehearsals" },
            ]}
            setOpen={setOpen}
            setValue={setServiceType}
            zIndex={3000}
            zIndexInverse={1000}
          />
        );
      case "dateButton":
        return (
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
        );
      case "durationContainer":
        return (
          <View style={styles.durationContainer}>
            <TextInput
              style={styles.durationInput}
              placeholder="Session Duration (Hours)"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <Text style={styles.durationText}>Hours</Text>
          </View>
        );
      case "requirementsInput":
        return (
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Session Requirements (any special requests)"
            value={requirements}
            onChangeText={setRequirements}
            multiline
            numberOfLines={3}
          />
        );
      case "uploadButton":
        return (
          <TouchableOpacity style={styles.uploadButton} onPress={pickFiles}>
            <Icon name="cloud-upload-outline" size={24} color="#666" />
            <Text style={styles.uploadText}>
              Upload Reference Files (Optional)
            </Text>
          </TouchableOpacity>
        );
      case "fileList":
        return referenceFiles.length > 0 ? (
          <View style={styles.fileList}>
            <Text style={styles.fileListTitle}>Uploaded Files:</Text>
            {referenceFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Icon name="document-outline" size={20} color="#666" />
                <Text
                  style={styles.fileName}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {file.name}
                </Text>
                <TouchableOpacity onPress={() => removeFile(index)}>
                  <Icon name="close-circle-outline" size={20} color="#ff6666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null;
      case "submitButton":
        return (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Book Session</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={formItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      />

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
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  durationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
  },
  durationText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
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
  fileList: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  fileListTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 5,
  },
  fileName: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    color: "#333",
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
