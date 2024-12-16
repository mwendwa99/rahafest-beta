import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "../../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { Text as CText } from "../../../components";
import {
  validatePassword,
  validateRequired,
} from "../../../utils/form_validation";
import { TextInput } from "react-native-paper";
import { createNewPassword } from "../../../redux/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import { success } from "../../../utils/toast";

export default function CreateNewPassword({ navigation }) {
  const [formData, setFormData] = useState({
    password: "",
    password_confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { otpResponse, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  console.log(JSON.stringify(error));

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = {
      password: "password",
      password_confirm: "password_confirm",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const { isValid, error } = validateRequired(formData[field], label);
      if (!isValid) newErrors[field] = error;
    });

    const passwordValidation = validatePassword(
      formData.password,
      formData.password_confirm
    );

    if (!passwordValidation.isValid)
      newErrors.password = passwordValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      ...formData,
      email: otpResponse?.token_data?.user_email,
    };

    const result = await dispatch(createNewPassword(data));

    if (createNewPassword.fulfilled.match(result)) {
      console.log("Result of createNewPassword:", result);
      success("Password reset successful!");
      navigation.navigate("Login");
    } else {
      danger("Password reset failed");
      console.log("Failed to reset password:", result.error.message);
    }
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <CText style={styles.errorText} value={errors[field]} />
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create new password </Text>
      <View style={styles.column}>
        <Input
          value={formData.password}
          onChange={(value) => handleInputChange("password", value)}
          placeholder="Password *"
          required
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        {getInputError("password")}
      </View>

      <View style={styles.column}>
        <Input
          value={formData.password_confirm}
          onChange={(value) => handleInputChange("password_confirm", value)}
          placeholder="Confirm Password *"
          required
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        {getInputError("password")}
      </View>

      <Button
        label={loading ? "Loading" : "Reset Password"}
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
