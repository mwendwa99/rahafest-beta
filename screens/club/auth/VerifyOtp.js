import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { Text as CText } from "../../../components";
import { validateOTP, validateRequired } from "../../../utils/form_validation";

export default function VerifyOtp({ navigation }) {
  const [formData, setFormData] = useState({
    otp: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = {
      otp: "otp",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const { isValid, error } = validateRequired(formData[field], label);
      if (!isValid) newErrors[field] = error;
    });

    const otpValidation = validateOTP(formData?.otp);

    if (!otpValidation.isValid) {
      newErrors.otp = otpValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // console.log(formData);
    navigation.navigate("CreateNewPassword");
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <CText style={styles.errorText} value={errors[field]} />
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={{}}>An OTP has been sent to your email!</Text>
      <View style={styles.inputContainer}>
        <Input
          type="number-pad"
          returnKeyType="done"
          onChange={(text) => handleInputChange("otp", text)}
        />
        {getInputError("otp")}
      </View>
      <Button
        label="Verify"
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
