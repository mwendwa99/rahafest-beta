// utils/validation.js

import { countries } from "../data/countries";

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

/**
 * Validates phone numbers against a list of known country calling codes
 * @param {string} phone - Phone number to validate (must start with +)
 * @returns {object} Validation result with status, error message, and normalized number
 */
export const validatePhone = (phone) => {
  // Handle empty input
  if (!phone || typeof phone !== "string") {
    return {
      isValid: false,
      error: "Phone number is required",
      normalizedPhone: null,
      country: null,
    };
  }

  // Check if starts with '+'
  // if (!phone.startsWith("+")) {
  //   return {
  //     isValid: false,
  //     error: "Phone number must start with '+'",
  //     normalizedPhone: null,
  //     country: null,
  //   };
  // }

  // Remove all whitespace and non-digit characters (except leading +)
  const trimmedPhone = phone.replace(/\s+/g, "");
  const digits = trimmedPhone.slice(1);

  // Basic length validation
  if (digits.length < 6 || digits.length > 15) {
    return {
      isValid: false,
      error: "Phone number must be between 6 and 15 digits (excluding '+')",
      normalizedPhone: null,
      country: null,
    };
  }

  // Find matching country code
  let matchedCountry = null;

  // Sort countries by calling code length (descending) to check longer codes first
  // This handles cases like "1-868" (Trinidad) vs "1" (US)
  const sortedCountries = [...countries].sort(
    (a, b) => b.callingCode.length - a.callingCode.length
  );

  for (const country of sortedCountries) {
    const cleanCallingCode = country.callingCode.replace(/[^0-9]/g, "");
    if (digits.startsWith(cleanCallingCode)) {
      matchedCountry = country;
      break;
    }
  }

  if (!matchedCountry) {
    return {
      isValid: false,
      error: "Invalid or unsupported country code",
      normalizedPhone: null,
      country: null,
    };
  }

  // Get the number of digits after the country code
  const cleanCallingCode = matchedCountry.callingCode.replace(/[^0-9]/g, "");
  const remainingDigits = digits.slice(cleanCallingCode.length);

  // Validate remaining digits length (typically 6-12 digits after country code)
  if (remainingDigits.length < 6 || remainingDigits.length > 12) {
    return {
      isValid: false,
      error: `Invalid number length for ${matchedCountry.name}`,
      normalizedPhone: null,
      country: null,
    };
  }

  return {
    isValid: true,
    error: null,
    normalizedPhone: `+${digits}`,
    country: matchedCountry,
  };
};

/**
 * Validates and formats a Kenyan phone number for Mpesa integration
 * @param {string} phone - Phone number to validate and format
 * @returns {object} Object containing validation status and formatted number
 */
export function validateMpesaPhone(phone) {
  // Remove any spaces, hyphens or other characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it's a valid length for Kenyan number (9 digits after prefix)
  if (cleanPhone.length !== 10 && cleanPhone.length !== 12) {
    return {
      isValid: false,
      message:
        "Phone number must be 10 digits (07xx/01xx) or 12 digits (254xx)",
      formattedNumber: null,
    };
  }

  let formattedNumber;

  // Handle numbers starting with '07' or '01'
  if (cleanPhone.length === 10) {
    if (!cleanPhone.match(/^(07|01)\d{8}$/)) {
      return {
        isValid: false,
        message: "Invalid Kenyan phone number format",
        formattedNumber: null,
      };
    }
    // Convert to international format
    formattedNumber = "254" + cleanPhone.substring(1);
  }

  // Handle numbers already in international format
  if (cleanPhone.length === 12) {
    if (!cleanPhone.match(/^254(7|1)\d{8}$/)) {
      return {
        isValid: false,
        message: "Invalid international format. Must start with 254",
        formattedNumber: null,
      };
    }
    formattedNumber = cleanPhone;
  }

  return {
    isValid: true,
    message: "Valid phone number",
    formattedNumber,
  };
}

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
