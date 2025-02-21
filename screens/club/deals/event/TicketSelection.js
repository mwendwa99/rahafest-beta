import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform, // Import Platform
  ActionSheetIOS, // Import ActionSheetIOS
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import the Picker from the community library

const TicketSelection = ({
  ticket,
  onTicketDetailsChange,
  defaultApplyAll = false,
  index,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [userDetails, setUserDetails] = useState([]);
  const [applyAllTickets, setApplyAllTickets] = useState(defaultApplyAll);
  const isTicketSelectionDisabled = ticket.available_tickets === 0; // Determine if selection is disabled

  useEffect(() => {
    if (quantity > userDetails.length) {
      const difference = quantity - userDetails.length;
      const newDetails = Array(difference)
        .fill(null)
        .map(() => ({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
        }));
      setUserDetails([...userDetails, ...newDetails]);
    } else if (quantity < userDetails.length) {
      setUserDetails(userDetails.slice(0, quantity));
    }
  }, [quantity]);

  useEffect(() => {
    onTicketDetailsChange(ticket.id, quantity, userDetails);
  }, [quantity, userDetails, ticket.id, onTicketDetailsChange]);

  const handleQuantityChange = (itemValue) => {
    // Picker or ActionSheet returns itemValue
    setQuantity(Math.max(0, itemValue));
  };

  const handleUserDetailsChange = (index, field, value) => {
    const updatedUserDetails = [...userDetails];
    if (!updatedUserDetails[index]) {
      updatedUserDetails[index] = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      };
    }
    updatedUserDetails[index] = {
      ...updatedUserDetails[index],
      [field]: value,
    };
    setUserDetails(updatedUserDetails);

    if (applyAllTickets) {
      const commonDetails = updatedUserDetails[index];
      const allDetails = userDetails.map((detail, i) =>
        i === index ? detail : commonDetails
      );
      setUserDetails(allDetails);
    }
  };

  const handleApplyAllTicketsChange = (isChecked) => {
    setApplyAllTickets(isChecked);
    if (isChecked && userDetails.length > 0) {
      const commonDetails = userDetails[0];
      const allDetails = Array(quantity).fill(commonDetails);
      setUserDetails(allDetails);
    }
  };

  const showActionSheet = () => {
    if (isTicketSelectionDisabled) {
      return; // Do nothing if selection is disabled
    }
    const quantityOptions = [...Array(11)]
      .map((_, i) => {
        const value = i;
        if (value <= ticket.available_tickets) {
          return String(value);
        } else {
          return null;
        }
      })
      .filter((option) => option !== null);

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...quantityOptions, "Cancel"],
        cancelButtonIndex: quantityOptions.length,
        title: "Select Quantity",
      },
      (buttonIndex) => {
        if (buttonIndex !== undefined && buttonIndex < quantityOptions.length) {
          handleQuantityChange(parseInt(quantityOptions[buttonIndex], 10));
        }
      }
    );
  };

  return (
    <View style={styles.ticketSelectionContainer}>
      <Text style={styles.ticketTitle}>
        {ticket.title} - {ticket.price_with_currency}
      </Text>

      <Text style={styles.quantityLabel}> Quantity</Text>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          style={[
            styles.quantityPickerIOS,
            isTicketSelectionDisabled && styles.quantityPickerDisabledIOS, // Apply disabled style
          ]}
          onPress={showActionSheet}
          disabled={isTicketSelectionDisabled} // Disable TouchableOpacity when tickets are sold out
        >
          <Text
            style={[
              styles.quantityPickerTextIOS,
              isTicketSelectionDisabled && styles.quantityPickerTextDisabledIOS, // Apply disabled text style
            ]}
          >
            {quantity}
          </Text>
        </TouchableOpacity>
      ) : (
        <Picker
          selectedValue={quantity}
          style={styles.quantityPicker}
          onValueChange={handleQuantityChange}
          enabled={!isTicketSelectionDisabled} // Disable Picker when tickets are sold out
        >
          {[...Array(11)].map((_, i) => {
            const value = i;
            if (value <= ticket.available_tickets) {
              return (
                <Picker.Item
                  key={value}
                  label={String(value)}
                  value={value}
                  style={{ borderWidth: 1, borderColor: "#c3c3c3" }}
                />
              );
            } else {
              return null;
            }
          })}
        </Picker>
      )}

      {quantity > 0 && (
        <View style={styles.userDetailsBox}>
          {Array.from({ length: quantity }).map((_, index) => (
            <View
              key={index}
              style={{
                ...styles.userDetailsBox,
                backgroundColor: "#f9f9f9",
                padding: 16,
                borderRadius: 4,
                marginTop: 16,
              }}
            >
              <Text style={styles.userDetailsTitle}>
                Ticket Holder {index + 1} Details
              </Text>
              <View style={styles.inputGrid}>
                <View style={styles.inputItemHalf}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    variant="outlined"
                    value={userDetails[index]?.first_name || ""}
                    onChangeText={(text) =>
                      handleUserDetailsChange(index, "first_name", text)
                    }
                    required
                  />
                </View>
                <View style={styles.inputItemHalf}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    variant="outlined"
                    value={userDetails[index]?.last_name || ""}
                    onChangeText={(text) =>
                      handleUserDetailsChange(index, "last_name", text)
                    }
                    required
                  />
                </View>
                <View style={styles.inputItemFull}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    variant="outlined"
                    keyboardType="email-address"
                    value={userDetails[index]?.email || ""}
                    onChangeText={(text) =>
                      handleUserDetailsChange(index, "email", text)
                    }
                    required
                  />
                </View>
                <View style={styles.inputItemFull}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    variant="outlined"
                    value={userDetails[index]?.phone || ""}
                    onChangeText={(text) =>
                      handleUserDetailsChange(index, "phone", text)
                    }
                    required
                  />
                </View>
              </View>
            </View>
          ))}
          <View style={styles.applyAllContainer}>
            <Switch
              value={applyAllTickets}
              onValueChange={handleApplyAllTicketsChange}
              style={styles.applyAllSwitch}
              trackColor={{ false: "#767577", true: "#B41818" }}
              thumbColor={applyAllTickets ? "#B41818" : "#f4f3f4"}
            />
            <Text style={styles.applyAllLabel}>
              Apply my details for rest of the tickets
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TicketSelection;

const styles = StyleSheet.create({
  ticketSelectionContainer: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  quantityPicker: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
  },
  quantityPickerIOS: {
    height: 40, // Mimic height of Android picker
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    justifyContent: "center", // Center text vertically
    paddingHorizontal: 10,
    backgroundColor: "#fff", // Default background color
  },
  quantityPickerTextIOS: {
    fontSize: 16, // Match text size of Android picker
    color: "black", // Default text color
  },
  quantityPickerDisabledIOS: {
    backgroundColor: "#f2f2f2", // Light grey background for disabled state
    borderColor: "#ddd", // Lighter border for disabled state
  },
  quantityPickerTextDisabledIOS: {
    color: "#999", // Grey text color for disabled state
  },
  userDetailsBox: {
    marginTop: 16,
  },
  userDetailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputItemHalf: {
    width: "48%",
    marginBottom: 16,
  },
  inputItemFull: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
  },
  applyAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  applyAllSwitch: {
    marginRight: 8,
  },
  applyAllLabel: {
    fontSize: 14,
  },
});
