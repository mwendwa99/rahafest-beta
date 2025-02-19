import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/api.service";

const { width } = Dimensions.get("window");
const isMobile = width < 768;

// Constants
const API_ENDPOINTS = {
  PAYMENT_INITIATE: "/invoices/initiate-payment",
  APPLY_COUPON: "/invoices/apply-coupon",
  UPDATE_INVOICE: "/invoice",
};

const STORAGE_KEY = "checkoutData";

// Utility functions
const formatCurrency = (amount) => `KES ${amount.toLocaleString()}`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("0") ? `254${cleaned.slice(1)}` : cleaned;
};
const validatePhoneNumber = (phone) => /^254[0-9]{9}$/.test(phone);

const CheckoutScreen = ({ navigation, route }) => {
  // Destructure from route.params.checkoutData instead of route.params directly
  const { checkoutData: routeCheckoutData } = route.params || {};
  const initialInvoice = routeCheckoutData?.invoice;
  const initialSelectedTickets = routeCheckoutData?.selectedTickets;
  const initialEvent = routeCheckoutData?.event;

  console.log(JSON.stringify(route.params));

  // State
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    invoice: null,
    selectedTickets: [],
    event: null,
  });

  // Load checkout data
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setPageLoading(true);

        // Use initial values from routeCheckoutData if available
        if (initialInvoice && initialSelectedTickets && initialEvent) {
          setCheckoutData({
            invoice: initialInvoice,
            selectedTickets: initialSelectedTickets,
            event: initialEvent,
          });
        } else {
          const storedData = await AsyncStorage.getItem(STORAGE_KEY);
          if (storedData) {
            setCheckoutData(JSON.parse(storedData));
          } else {
            throw new Error(
              "No checkout data available. Please select tickets first."
            );
          }
        }
      } catch (err) {
        console.error("Failed to load checkout data:", err);
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    loadCheckoutData();
  }, [initialInvoice, initialSelectedTickets, initialEvent]); // Depend on the initial props

  // Calculations
  const invoiceAmount = useMemo(
    () => Number(checkoutData.invoice?.invoice_amount) || 0,
    [checkoutData.invoice]
  );

  const totalPayable = useMemo(
    () => invoiceAmount - discountedAmount,
    [invoiceAmount, discountedAmount]
  );

  // Payment handlers
  const handleCouponSubmit = async () => {
    if (!couponCode || !checkoutData.invoice?.invoice_number) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.post(API_ENDPOINTS.APPLY_COUPON, {
        coupon_code: couponCode,
        invoice_number: checkoutData.invoice.invoice_number,
      });

      const originalAmount = checkoutData.invoice.invoice_amount;
      const newAmount = response.data.data.Invoice_amount; // Assuming Invoice_amount is still the correct field
      setDiscountedAmount(originalAmount - newAmount);
      setSuccess("Coupon applied successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!checkoutData.invoice?.invoice_number) {
      setError("Invalid invoice data");
      return;
    }

    if (paymentMethod === "mpesa") {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      if (!validatePhoneNumber(formattedPhone)) {
        setError("Please enter a valid phone number");
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        invoice_number: checkoutData.invoice.invoice_number,
        invoice_amount: checkoutData.invoice.invoice_amount,
        phone: formatPhoneNumber(phoneNumber),
        coupon: couponCode || undefined,
        payment_method: paymentMethod,
        event_id: checkoutData.event?.id,
      };

      if (paymentMethod === "mpesa") {
        const response = await api.post(
          API_ENDPOINTS.PAYMENT_INITIATE,
          payload
        );
        setSuccess("Please check your phone for the STK push");
      } else {
        // Handle card payment - integrate with your payment gateway
        Alert.alert("Card Payment", "Card payment integration pending");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B41818" />
      </View>
    );
  }

  if (
    error &&
    (!checkoutData.invoice || !checkoutData.selectedTickets.length)
  ) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Order Summary #{checkoutData.invoice?.invoice_number}
          </Text>

          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{checkoutData.event?.title}</Text>
            <Text style={styles.eventDetail}>{checkoutData.event?.venue}</Text>
            <Text style={styles.eventDetail}>
              {formatDate(checkoutData.event?.start_date)} -
              {formatDate(checkoutData.event?.end_date)}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Tickets */}
          {checkoutData.selectedTickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketItem}>
              <Text style={styles.ticketTitle}>
                {ticket.title} x{ticket.quantity}
              </Text>
              <Text style={styles.ticketPrice}>
                {formatCurrency(ticket.price)} each
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Price Summary */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(invoiceAmount)}</Text>
            </View>

            {discountedAmount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.discountText}>Discount</Text>
                <Text style={styles.discountText}>
                  - {formatCurrency(discountedAmount)}
                </Text>
              </View>
            )}

            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>
                {formatCurrency(totalPayable)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>

          {/* Coupon */}
          <View style={styles.couponContainer}>
            <Text style={styles.subtitle}>Have a coupon?</Text>
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter coupon code"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity
                style={styles.couponButton}
                onPress={handleCouponSubmit}
                disabled={!couponCode || loading}
              >
                <Text style={styles.couponButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Payment Method */}
          <Text style={styles.subtitle}>Select Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setPaymentMethod("mpesa")}
            >
              <View style={styles.radio}>
                {paymentMethod === "mpesa" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.paymentOptionText}>M-Pesa</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setPaymentMethod("card")}
            >
              <View style={styles.radio}>
                {paymentMethod === "card" && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.paymentOptionText}>Card</Text>
            </TouchableOpacity> */}
          </View>

          {paymentMethod === "mpesa" && (
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="Enter M-Pesa number (e.g., 0712345678)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          )}

          {error && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorAlertText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successAlert}>
              <Text style={styles.successAlertText}>{success}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>
                Pay {formatCurrency(totalPayable)}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By proceeding with the payment, you agree to our terms and
            conditions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#B41818",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: "#B41818",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  eventInfo: {
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B41818",
    marginBottom: 5,
  },
  eventDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  ticketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  ticketPrice: {
    fontSize: 16,
    color: "#666",
  },
  priceContainer: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  discountText: {
    color: "#4CAF50",
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  couponContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  couponInputContainer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  phoneInput: {
    marginTop: 10,
  },
  couponButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  couponButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  paymentMethods: {
    marginTop: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B41818",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#B41818",
  },
  paymentOptionText: {
    fontSize: 16,
  },
  errorAlert: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  errorAlertText: {
    color: "#c62828",
    fontSize: 14,
  },
  successAlert: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  successAlertText: {
    color: "#2e7d32",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#B41818",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#d32f2f",
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
  },
});

export default CheckoutScreen;
