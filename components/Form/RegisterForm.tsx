//@ts-nocheck
import React, { useCallback, useState, memo } from "react";
import {
  TextInput,
  StyleSheet,
  Pressable,
  View,
  ScrollView,
} from "react-native";
import Container from "../Container";
import Typography from "../Typography";
import Button from "../Button";
import { Link } from "expo-router";

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
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
    marginTop: 8,
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
  passwordStrength: {
    marginTop: -8,
    marginBottom: 8,
  },
  strengthIndicator: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5EA",
  },
});

// Memoized Input component
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
      />
      {error && <Typography style={styles.error}>{error}</Typography>}
    </>
  )
);

// Password strength indicator component
const PasswordStrengthIndicator = memo(({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759"];

  return (
    <View style={styles.passwordStrength}>
      <Typography style={{ color: "#8E8E93" }}>
        Password strength:{" "}
        {["Weak", "Fair", "Good", "Strong"][strength - 1] || "Too weak"}
      </Typography>
      <View style={styles.strengthIndicator}>
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              {
                backgroundColor:
                  i < strength ? colors[strength - 1] : "#E5E5EA",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
});

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "First name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation
    if (
      formData.phoneNumber &&
      !/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain uppercase, number, and special character";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
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
        Register
      </Typography>

      <FormInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={handleChange("firstName")}
        error={errors.firstName}
      />

      <FormInput
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={handleChange("lastName")}
        error={errors.lastName}
      />

      <FormInput
        placeholder="Email"
        value={formData.email}
        onChangeText={handleChange("email")}
        error={errors.email}
      />

      <FormInput
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChangeText={handleChange("phoneNumber")}
        error={errors.phoneNumber}
      />

      <FormInput
        placeholder="Password"
        value={formData.password}
        onChangeText={handleChange("password")}
        secureTextEntry
        error={errors.password}
      />

      <PasswordStrengthIndicator password={formData.password} />

      <FormInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={handleChange("confirmPassword")}
        secureTextEntry
        error={errors.confirmPassword}
      />
      <Typography variant="body2" align="center" gutterBottom>
        by clicking on register you agree to our{" "}
        <Link
          href={
            "https://docs.google.com/document/d/1LzwcqLXVUnnsV9jgzGNj_ZPyZ3oIepuw/edit?pli=1"
          }
          style={{ color: "yellow" }}
        >
          policy
        </Link>
      </Typography>

      <Button onPress={handleSubmit}>Register</Button>
    </View>
  );
};

export default memo(RegisterForm);
