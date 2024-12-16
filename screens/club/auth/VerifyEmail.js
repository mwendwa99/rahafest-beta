import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { Text as CText } from "../../../components";
import {
  validateEmail,
  validateRequired,
} from "../../../utils/form_validation";

export default function VerifyEmail({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = {
      email: "email",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const { isValid, error } = validateRequired(formData[field], label);
      if (!isValid) newErrors[field] = error;
    });

    const emailValidation = validateEmail(formData?.email);

    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // console.log(formData);

    navigation.navigate("VerifyOtp");
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <CText style={styles.errorText} value={errors[field]} />
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify email</Text>
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
      <Button
        label="Proceed"
        variant="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 700,
    marginVertical: 10,
  },
  inputContainer: {
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
});
