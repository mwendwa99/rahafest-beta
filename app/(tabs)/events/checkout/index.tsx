//@ts-nocheck
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { triggerSTK } from "@/store/app/appActions";
import { generateHostedCheckoutData } from "./security"; // Use the refactored Visa function
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { useRouter } from "expo-router";
import VisaPaymentWebView from "./WebView"; // Import the WebView component

const CheckoutPage = () => {
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [visaLoading, setVisaLoading] = useState(false);
  const [showVisaWebView, setShowVisaWebView] = useState(false);
  const [formData, setFormData] = useState<string | null>(null); // For Visa query string

  const router = useRouter();
  const { invoice } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { amount_paid, first_name, last_name, phone, email } =
    invoice?.data?.attendeeInfo[0] || "";

  const handlePaymentOption = async (paymentMethod: string) => {
    if (paymentMethod === "mpesa") {
      setMpesaLoading(true);
      try {
        await dispatch(
          triggerSTK({
            invoice_number: invoice?.invoice_number as string,
            total_amount: invoice?.total_amount as number,
            phone: phone as string,
            fcm_token: null,
            primary_email: email as string,
          })
        );
        router.replace("/"); // Redirect after payment
      } catch (error) {
        console.error("Error during MPESA payment:", error);
      } finally {
        setMpesaLoading(false);
      }
    } else if (paymentMethod === "visa") {
      setVisaLoading(true);
      try {
        const formData = generateHostedCheckoutData(invoice);
        setFormData(formData);
        setShowVisaWebView(true);
      } catch (error) {
        console.error("Error during Visa payment:", error);
      } finally {
        setVisaLoading(false);
      }
    }
  };

  return showVisaWebView && formData ? (
    // Render WebView for Visa payment
    <VisaPaymentWebView formData={formData} />
  ) : (
    <Container style={styles.container}>
      <Typography variant="h1">Purchase Summary</Typography>
      <Typography>Invoice Number: {invoice?.invoice_number}</Typography>
      <Typography>
        Attendee: {first_name} {last_name}
      </Typography>
      <Typography>Email: {email}</Typography>
      <Typography>Total Amount: KES {invoice?.total_amount}</Typography>
      <Typography>Payment Phone: {phone}</Typography>

      {/* Payment Options */}
      <View style={styles.buttonsContainer}>
        <Button onPress={() => handlePaymentOption("mpesa")}>
          {mpesaLoading ? "Loading..." : "Pay with M-PESA"}
        </Button>
        <Button onPress={() => handlePaymentOption("visa")}>
          {visaLoading ? "Loading..." : "Pay with Visa"}
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 20,
    flex: 1,
  },
  buttonsContainer: {
    marginVertical: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default CheckoutPage;
