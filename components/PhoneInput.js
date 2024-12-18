import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { countries } from "../data/countries";
import { Picker } from "@react-native-picker/picker";

const PhoneInputComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("KE");
  console.log({ phoneNumber });

  const handlePhoneNumberChange = (text) => {
    const formattedText = text.replace(
      /^0/,
      countries.find((c) => c.code === selectedCountry).callingCode
    );
    setPhoneNumber(formattedText);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue) => setSelectedCountry(itemValue)}
        style={styles.picker}
      >
        {countries.map((country) => (
          <Picker.Item
            key={country.code}
            label={`${country.name} (+${country.callingCode})`}
            value={country.code}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  picker: {
    height: 50,
    width: 150,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
});

export default PhoneInputComponent;
