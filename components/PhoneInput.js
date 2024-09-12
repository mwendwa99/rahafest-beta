import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";
import Input from "./Input";
import Button from "./Button";
import Text from "./Text";

export default function PhoneInput({
  value,
  setPhoneInput,
  handlePhoneUpdate,
}) {
  return (
    <View style={styles.container}>
      <Text value="Please enter your M-PESA number" variant="subtitle" />
      <Text
        value="This will be used to send you a payment prompt"
        variant="body"
      />
      <Input
        placeholder="Phone Number"
        type="phone-pad"
        value={value}
        onChange={(text) => setPhoneInput(text)} // Handle input without closing
        style={{ width: "90%" }}
      />
      <Button
        label="Confirm"
        variant={"contained"}
        onPress={handlePhoneUpdate} // Update all attendees and close modal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
