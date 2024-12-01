//@ts-nocheck
import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { triggerSTK } from "@/store/app/appActions";
import { handleVisaProceed } from "./security";
import Typography from "@/components/Typography";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { useRouter } from "expo-router";

const CheckoutPage = () => {
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [visaLoading, setVisaLoading] = useState(false);

  const router = useRouter();

  const { invoice } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { amount_paid, first_name, last_name, phone, email } =
    invoice?.data?.attendeeInfo[0] || "";

  // Handle the payment option selection
  const handlePaymentOption = async (paymentMethod: string) => {
    if (paymentMethod === "mpesa") {
      setMpesaLoading(true);

      try {
        // Dispatch the STK trigger and wait for it to complete
        await dispatch(
          triggerSTK({
            invoice_number: invoice?.invoice_number as string,
            total_amount: invoice?.total_amount as number,
            phone: phone as string,
            fcm_token: null,
            primary_email: email as string,
          })
        );
        // Once dispatch is successful, navigate to the home page
        router.replace("/");
      } catch (error) {
        console.error("Error during MPESA payment:", error);
        // Handle any errors that occur during dispatch
      } finally {
        setMpesaLoading(false);
      }
    } else if (paymentMethod === "visa") {
      setVisaLoading(true);
      // Call your Visa payment function
      await handleVisaProceed(invoice);
      setVisaLoading(false);
      // You can navigate to the home page here as well if needed
    }
  };

  return (
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
          Pay with M-PESA
        </Button>
        <Button onPress={() => handlePaymentOption("visa")}>
          Pay with Visa
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 20,
  },

  buttonsContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default CheckoutPage;
