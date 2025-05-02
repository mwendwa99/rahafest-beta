import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Text as RNText,
} from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, TextInput } from "react-native-paper";

import { Input, Button, Text } from "../../../components";
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validatePassword,
} from "../../../utils/form_validation";
import { registerUser } from "../../../store/auth/authActions";

const pattern = require("../../../assets/pattern.png");

export default function Register({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();
  const {
    user,
    error: authError,
    loading,
  } = useSelector((state) => state.auth);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  useEffect(() => {
    if (authError) {
      // Handle API error responses
      if (typeof authError === "object" && authError.message) {
        if (typeof authError.message === "object") {
          // Handle missing fields error
          const newErrors = {};
          Object.entries(authError.message).forEach(([field, messages]) => {
            newErrors[field] = messages[0];
          });
          setErrors(newErrors);
        } else {
          // Handle general error message
          setErrors({ general: authError.message });
        }
      }
    }
  }, [authError]);

  useEffect(() => {
    if (user && !authError) {
      // Auto-login logic here
      navigation.navigate("Home"); // Or wherever your main app screen is
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    const requiredFields = {
      firstName: "First Name",
      lastName: "Last Name",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const { isValid, error } = validateRequired(formData[field], label);
      if (!isValid) newErrors[field] = error;
    });

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.error;

    // Validate phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error;

    // Validate password
    const passwordValidation = validatePassword(
      formData.password,
      formData.confirmPassword
    );
    if (!passwordValidation.isValid)
      newErrors.password = passwordValidation.error;

    // Validate terms and conditions
    if (!checked) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    const registerData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      phone: formData.phone,
      email: formData.email,
      tc: checked,
    };

    // console.log(registerData);

    dispatch(registerUser(registerData));
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <Text style={{ color: "red" }} value={errors[field]} />
    ) : null;
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={pattern}
        resizeMode="repeat"
        style={styles.imageBg}
      >
        <ScrollView style={styles.section}>
          <View style={styles.section}>
            <RNText
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Register
            </RNText>
            {errors.general && (
              <Text
                style={{ color: "red", textAlign: "center", marginBottom: 10 }}
                value={errors.general}
              />
            )}

            <View style={styles.column}>
              <Input
                required
                value={formData.firstName}
                onChange={(value) => handleInputChange("firstName", value)}
                placeholder="First Name *"
              />
              {getInputError("firstName")}
            </View>

            <View style={styles.column}>
              <Input
                required
                value={formData.lastName}
                onChange={(value) => handleInputChange("lastName", value)}
                placeholder="Last Name *"
              />
              {getInputError("lastName")}
            </View>

            <View style={styles.column}>
              <Input
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                placeholder="Email *"
                keyboardType="email-address"
                inputMode="email"
                autoComplete="email"
                required
              />
              {getInputError("email")}
            </View>

            <View style={styles.column}>
              <Input
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder="Phone (e.g., 254712345678) *"
                keyboardType="phone-pad"
                inputMode="tel"
                autoComplete="tel"
                required
              />
              {getInputError("phone")}
            </View>

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
                value={formData.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
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

            {Platform.OS === "android" ? (
              <View style={styles.row}>
                <Checkbox
                  status={checked ? "checked" : "unchecked"}
                  color="#fff" // Color when checked
                  uncheckedColor="#ccc" // Color when unchecked
                  onPress={() => setChecked(!checked)}
                />
                <Text
                  value="Agree to the terms and conditions"
                  variant="body"
                  style={{ color: "#fff" }}
                />
              </View>
            ) : (
              <Checkbox.Item
                status={checked ? "checked" : "unchecked"}
                color="#fff" // Color when checked
                uncheckedColor="#ccc" // Color when unchecked
                labelStyle={{ color: "#fff" }}
                label="Tap here to agree to the terms and conditions"
                onPress={() => setChecked(!checked)}
              />
            )}

            {getInputError("terms")}

            <Button
              label={loading ? "Registering..." : "Register"}
              onPress={handleSignup}
              variant="contained"
            />

            <Button
              label="Already have an account? Login"
              onPress={() => navigation.navigate("Login")}
              variant="text"
              style={{ color: "#fff" }}
            />
          </View>
        </ScrollView>
        <StatusBar style="light" />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBg: {
    margin: "auto",
    maxWidth: 500,
    width: "100%",
    height: "100%",
  },

  logo: {
    height: 100,
    width: 100,
    objectFit: "contain",
  },
  section: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "rgba(0,0,0, 0.7)",
  },
  row: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
