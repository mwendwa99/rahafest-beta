//@ts-nocheck
import React, { useCallback, useState, memo } from "react";
import { TextInput, StyleSheet, Pressable, View } from "react-native";
import Container from "../Container";
import Typography from "../Typography";
import Button from "../Button";

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    width: "100%",
    padding: 16,
  },
  error: {
    color: "#FF3B30",
    marginBottom: 8,
  },
});

// Memoized Input component for better performance
const FormInput = memo(
  ({ placeholder, value, onChangeText, secureTextEntry, error }) => (
    <>
      <TextInput
        style={[
          styles.input,
          error && { borderColor: "#FF3B30", borderWidth: 1 },
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        placeholderTextColor="#888888"
      />
      {error && <Typography style={styles.error}>{error}</Typography>}
    </>
  )
);

interface LoginFormProps {
  handleLogin: (data) => void;
}

const LoginForm = ({ handleLogin }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      // console.log("Form submitted:", formData);
      handleLogin(formData.email, formData.password);
    }
  }, [formData, validateForm]);

  const handleChange = useCallback(
    (field) => (value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    },
    [errors]
  );

  return (
    <View style={styles.form}>
      <Typography variant="h1" style={{ marginBottom: 24 }}>
        Login
      </Typography>

      <FormInput
        placeholder="Email"
        value={formData.email}
        onChangeText={handleChange("email")}
        error={errors.email}
      />

      <FormInput
        placeholder="Password"
        value={formData.password}
        onChangeText={handleChange("password")}
        secureTextEntry
        error={errors.password}
      />

      <Button onPress={handleSubmit}>Login</Button>
    </View>
  );
};

export default memo(LoginForm);
