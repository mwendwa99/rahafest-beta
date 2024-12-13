import { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../../../redux/auth/authActions";
import { clearError } from "../../../redux/auth/authSlice";
import { Input, Button, Text } from "../../../components";
import { validateEmail } from "../../../utils/form_validation";

import pattern from "../../../assets/pattern.png";
import { TextInput } from "react-native-paper";
const logo = require("../../../assets/logo.png");

export default function Login({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { error: authError, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
    setErrors({}); // Clear any previous errors
  }, []);

  useEffect(() => {
    if (authError) {
      // Handle different types of API error responses
      if (typeof authError === "object") {
        if (authError.message === "Invalid Credentials") {
          setErrors({ general: "Invalid email or password" });
        } else if (typeof authError.message === "object") {
          // Handle field-specific errors from API
          const newErrors = {};
          Object.entries(authError.message).forEach(([field, messages]) => {
            newErrors[field] = messages[0];
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: authError.message });
        }
      }
    }
  }, [authError]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: null, general: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    dispatch(loginUser(loginData));
  };

  const getInputError = (field) => {
    return errors[field] ? (
      <Text style={{ color: "red" }} value={errors[field]} />
    ) : null;
  };

  return (
    <ImageBackground
      source={pattern}
      resizeMode="repeat"
      style={styles.container}
    >
      <View style={styles.section}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.section}>
          {errors.general && (
            <Text
              style={{ color: "red", textAlign: "center", marginBottom: 10 }}
              value={errors.general}
            />
          )}

          <View style={styles.row}>
            <Input
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Email"
              keyboardType="email-address"
              inputMode="email"
              autoComplete="email"
            />
          </View>
          {getInputError("email")}

          <View style={styles.row}>
            <Input
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Password"
              keyboardType="default"
              autoComplete="password"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
                  size={24}
                />
              }
            />
          </View>
          {getInputError("password")}

          <Button
            label={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            variant="contained"
          />
          <Button
            label="New here? Register"
            onPress={() => navigation.navigate("Register")}
            variant="text"
          />
        </View>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logoContainer: {
    alignItems: "center",
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
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});
