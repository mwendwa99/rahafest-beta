import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "../utils/form_validation";
import Input from "./Input";
import Text from "./Text";
import Button from "./Button";

const UserForm = ({ userInfo, setUserInfo, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: userInfo.first_name || "",
    last_name: userInfo.last_name || "",
    email: userInfo.email || "",
    phone: userInfo.phone || "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = {
      first_name: "First Name",
      last_name: "Last Name",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const { isValid, error } = validateRequired(formData[field], label);
      if (!isValid) newErrors[field] = error;
    });

    const emailValidation = validateEmail(formData?.email);

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    const phoneValidation = validatePhone(formData?.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Pass formData to parent component immediately
    setUserInfo(formData);
    onClose(formData); // Pass formData to parent
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <Text style={styles.errorText} value={errors[field]} />
    ) : null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text value="Enter Your Information" variant="subtitle" />

      <View style={styles.inputContainer}>
        <Input
          placeholder="First Name"
          value={formData?.first_name}
          onChange={(text) => handleInputChange("first_name", text)}
        />
        {getInputError("first_name")}
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Last Name"
          value={formData?.last_name}
          onChange={(text) => handleInputChange("last_name", text)}
        />
        {getInputError("last_name")}
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          value={formData?.email}
          keyboardType="email-address"
          inputMode="email"
          autoComplete="email"
          onChange={(text) => handleInputChange("email", text)}
        />
        {getInputError("email")}
      </View>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Phone Number (e.g., 254712345678)"
          value={formData?.phone}
          keyboardType="number-pad"
          inputMode="tel"
          autoComplete="tel"
          onChange={(text) => handleInputChange("phone", text)}
        />
        <Text
          value="Do not include the '+' symbol"
          style={{ color: "#888888" }}
        />
        {getInputError("phone")}
      </View>

      <Button
        label="Proceed"
        variant="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default UserForm;
