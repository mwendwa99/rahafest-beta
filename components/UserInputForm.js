import React from "react";
import { View, StyleSheet } from "react-native";

import Input from "./Input";
import Text from "./Text";

const UserInputForm = (props) => {
  return (
    <View style={styles.container}>
      <Text value="Enter Your Information" variant="subtitle" />
      <Input
        placeholder="First Name"
        onChange={(text) => {
          // Update the first name of the user
        }}
      />
      <Input
        placeholder="Last Name"
        onChange={(text) => {
          // Update the last name of the user
        }}
      />
      <Input
        placeholder="Email"
        onChange={(text) => {
          // Update the email of the user
        }}
      />
      <Input
        placeholder="Phone Number"
        type="number-pad"
        onChange={(text) => {
          // Update the phone number of the user
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserInputForm;
