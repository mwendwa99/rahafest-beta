// utils/validation.js

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, error: "Email is required" };
  if (!emailRegex.test(email))
    return { isValid: false, error: "Invalid email format" };
  return { isValid: true, error: null };
};

export const validateOTP = (otp) => {
  // First, handle empty input
  if (!otp) {
    return { isValid: false, error: "OTP is required" };
  }

  // Check if the OTP is numeric
  if (!/^\d+$/.test(otp)) {
    return { isValid: false, error: "OTP must be numeric" };
  }

  // Check if the OTP has exactly 6 digits
  if (otp.length !== 6) {
    return { isValid: false, error: "OTP must be 6 digits" };
  }

  // All validations passed
  return { isValid: true, error: null };
};

export const validatePhone = (phone) => {
  // First, handle empty input
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Remove all non-digit characters, including spaces and the '+' symbol
  const cleanPhone = phone.replace(/[^\d]/g, ""); // This removes any non-digit characters

  // Check if the number has exactly 12 digits
  if (cleanPhone.length !== 12) {
    return {
      isValid: false,
      error: "Phone number must include country code e.g. 2547...",
    };
  }

  // Check if starts with any 3-digit country code
  const countryCode = cleanPhone.slice(0, 3);
  if (!/^\d{3}$/.test(countryCode)) {
    return {
      isValid: false,
      error: "Phone number must start with a 3-digit country code",
    };
  }

  // All validations passed
  return {
    isValid: true,
    error: null,
    normalizedPhone: cleanPhone, // Return the cleaned number for use
  };
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

export const validatePassword = (password, confirmPassword) => {
  if (!password) return { isValid: false, error: "Password is required" };
  if (password.length < 8)
    return { isValid: false, error: "Password must be at least 8 characters" };
  if (password !== confirmPassword)
    return { isValid: false, error: "Passwords do not match" };
  return { isValid: true, error: null };
};
