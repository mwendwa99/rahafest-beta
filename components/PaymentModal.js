import { View, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import Text from "./Text";
import Button from "./Button";

import { triggerSTK } from "../redux/events/eventActions";
import { useDispatch, useSelector } from "react-redux";

const PaymentModal = ({ invoice, toggleModal }) => {
  const dispatch = useDispatch();
  const { paymentData, error } = useSelector((state) => state.events);

  const handleTriggerSTK = () => {
    const stkData = {
      id: invoice?.id || "",
      invoice_number: invoice?.invoice_number || "",
      total_amount: invoice?.total_amount || "",
      phone: invoice?.data?.attendeeInfo[0]?.phone || "",
      fcm_token: null,
      primary_email: invoice?.data?.attendeeInfo[0]?.email || "",
    };

    dispatch(triggerSTK(stkData));

    toggleModal();
  };

  return (
    <View style={styles.container}>
      <Text value="Success!" style={{ color: "green" }} variant="subtitle" />
      <View style={{ ...styles.row, justifyContent: "space-between" }}>
        <Text value={invoice?.invoice_number} variant="title" />
        <Text
          value={invoice?.data?.attendeeInfo[0]?.ticket_name || ""}
          variant="title"
        />
      </View>
      <Text
        value={invoice?.data?.attendeeInfo[0]?.event_name || ""}
        variant="title"
      />
      <View style={styles.row}>
        <Text
          value={`Name: ${invoice?.data?.attendeeInfo[0]?.first_name || ""}`}
          variant="body"
        />
        <Text
          value={` ${invoice?.data?.attendeeInfo[0]?.last_name || ""}`}
          variant="body"
        />
      </View>
      <Text
        value={`Phone: ${invoice?.data?.attendeeInfo[0]?.phone || ""}`}
        variant="body"
      />
      <Text
        value={`Email: ${invoice?.data?.attendeeInfo[0]?.email || ""}`}
        variant="body"
      />
      <Text value={invoice?.data?.invoice_number || ""} variant="title" />
      <View style={{ ...styles.row, justifyContent: "space-between" }}>
        <Text value={"Payment Method"} variant="subtitle" />
        <Text value={"M-PESA"} variant="subtitle" />
      </View>
      <Text
        value={`Total amount: ${invoice?.total_amount || ""}`}
        variant="subtitle"
      />

      <View style={{ width: "100%" }}>
        <Button label="Pay" variant="contained" onPress={handleTriggerSTK} />
      </View>
    </View>
  );
};

export default PaymentModal;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "flex-start",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    textAlign: "left",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
});
