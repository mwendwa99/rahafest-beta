import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

import Input from "./Input";
import Text from "./Text";
import Button from "./Button";

const UserInputForm = ({ attendeeInfo, setAttendeeInfo, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = () => {
    // Validate fields
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone
    ) {
      console.log({ formData });
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Update all attendee info with the new user data
    const updatedAttendeeInfo = attendeeInfo.map((attendee) => ({
      ...attendee,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
    }));

    setAttendeeInfo(updatedAttendeeInfo);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text value="Enter Your Information" variant="subtitle" />
      <Input
        placeholder="First Name"
        value={formData.first_name}
        onChange={(text) =>
          setFormData((prev) => ({ ...prev, first_name: text }))
        }
      />
      <Input
        placeholder="Last Name"
        value={formData.last_name}
        onChange={(text) =>
          setFormData((prev) => ({ ...prev, last_name: text }))
        }
      />
      <Input
        placeholder="Email"
        value={formData.email}
        keyboardType="email-address"
        onChange={(text) => setFormData((prev) => ({ ...prev, email: text }))}
      />
      <Input
        placeholder="Phone Number"
        value={formData.phone}
        keyboardType="number-pad"
        onChange={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
      />
      <Button
        label="Save"
        variant="contained"
        onPress={handleSubmit}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default UserInputForm;
