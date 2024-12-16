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

export default function CreateNewPassword({ navigation }) {
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = {
      password: "password",
      confirm_password: "confirm_password",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const { isValid, error } = validateRequired(formData[field], label);
      if (!isValid) newErrors[field] = error;
    });

    const passwordValidation = validatePassword(
      formData.password,
      formData.confirm_password
    );

    if (!passwordValidation.isValid)
      newErrors.password = passwordValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log(formData);
    navigation.navigate("Login");
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
          value={formData.confirm_password}
          onChange={(value) => handleInputChange("confirm_password", value)}
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
        label="Change Password"
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
