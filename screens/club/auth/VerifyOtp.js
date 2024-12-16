import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { Text as CText } from "../../../components";
import { validateOTP, validateRequired } from "../../../utils/form_validation";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../../../redux/auth/authActions";
import { danger, success } from "../../../utils/toast";

export default function VerifyOtp({ navigation }) {
  const [formData, setFormData] = useState({
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const { otpResponse, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // console.log(formData);
    // navigation.navigate("CreateNewPassword");

    const data = {
      ...formData,
      email: otpResponse?.token_data?.user_email,
    };

    // console.log(data);

    const result = await dispatch(verifyOTP(data));

    if (verifyOTP.fulfilled.match(result)) {
      success("OTP Verified!");
      navigation.navigate("CreateNewPassword");
    } else {
      danger("Invalid OTP!");
      console.log("Failed to verify email:", result.error.message);
    }
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <CText style={styles.errorText} value={errors[field]} />
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={{}}>Enter OTP that has been sent to your email</Text>
      <View style={styles.inputContainer}>
        <Input
          type="number-pad"
          returnKeyType="done"
          onChange={(text) => handleInputChange("otp", text)}
        />
        {getInputError("otp")}
      </View>
      {otpResponse && otpResponse.token_data && (
        <Text style={styles.attempts}>
          attempts remaining (
          {parseInt(otpResponse.token_data.max_attempts || 0) -
            parseInt(otpResponse.token_data.attempts || 0)}
          )
        </Text>
      )}
      <Button
        label={loading ? "Loading..." : "Verify"}
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
  attempts: {
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
});
